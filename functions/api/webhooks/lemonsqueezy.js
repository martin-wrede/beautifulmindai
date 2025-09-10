// functions/api/webhooks/lemonsqueezy.js

// Import your reusable Airtable helper functions
import { initAirtable, findUserByClerkId, updateUserSubscription } from '../../utils/airtable.js';

// Helper function to convert an ArrayBuffer to a hex string for comparison
const bufferToHex = (buffer) => {
  return [...new Uint8Array(buffer)]
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

/**
 * Securely verifies the webhook signature using the Web Crypto API,
 * which is available in the Cloudflare Workers environment.
 * @param {string} secret - Your LEMON_SQUEEZY_SIGNING_SECRET
 * @param {string} signature - The signature from the 'X-Signature' header
 * @param {string} rawBody - The raw, unparsed request body
 * @returns {Promise<boolean>} - True if the signature is valid, false otherwise
 */
const verifySignature = async (secret, signature, rawBody) => {
  if (!signature) {
    console.error("Signature header is missing.");
    return false;
  }

  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signedBody = await crypto.subtle.sign('HMAC', key, encoder.encode(rawBody));
    const calculatedSignature = bufferToHex(signedBody);

    return calculatedSignature === signature;
  } catch (error) {
    console.error("Error during signature verification:", error);
    return false;
  }
};

/**
 * This is the main Cloudflare Function handler for POST requests.
 * It listens for notifications from Lemon Squeezy and updates user data in Airtable.
 */
export async function onRequestPost(context) {
  // --- 1. Get Secrets from Cloudflare Environment ---
  const { LEMON_SQUEEZY_SIGNING_SECRET, AIRTABLE_API_KEY, AIRTABLE_BASE_ID } = context.env;
  
  if (!LEMON_SQUEEZY_SIGNING_SECRET || !AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    console.error("FATAL: Missing required environment variables on Cloudflare.");
    return new Response('Server configuration error', { status: 500 });
  }

  // --- 2. Verify the Webhook Signature ---
  const signature = context.request.headers.get('X-Signature');
  const rawBody = await context.request.text();
  const isValid = await verifySignature(LEMON_SQUEEZY_SIGNING_SECRET, signature, rawBody);
  
  if (!isValid) {
    console.warn("Invalid webhook signature received. Request rejected.");
    return new Response('Invalid signature', { status: 401 });
  }
  
  try {
    // --- 3. Parse the Validated Data ---
    const payload = JSON.parse(rawBody);
    const eventName = payload.meta.event_name;
    const clerkUserId = payload.meta.custom_data?.clerk_user_id;
    
    if (!clerkUserId) {
      console.warn("Webhook processed, but no clerk_user_id found in custom_data.");
      return new Response('Webhook processed, but user identifier was missing.', { status: 200 });
    }
    
    // --- 4. Initialize Airtable Connection ---
    initAirtable({ apiKey: AIRTABLE_API_KEY, baseId: AIRTABLE_BASE_ID });

    // --- 5. Find the Corresponding User in Airtable ---
    const userRecord = await findUserByClerkId(clerkUserId);

    if (!userRecord) {
      console.error(`Webhook received for an unknown user in our database. Clerk ID: ${clerkUserId}`);
      // Return 200 so Lemon Squeezy doesn't retry for a user we don't have.
      return new Response('User not found in our database.', { status: 200 });
    }

    // --- 6. Handle Different Subscription Events ---
    const subscription = payload.data;
    switch (eventName) {
      case 'subscription_created':
      case 'subscription_resumed':
      case 'subscription_unpaused':
        console.log(`Activating subscription for user: ${clerkUserId}`);
        await updateUserSubscription(userRecord.id, {
          "subscription_status": "active",
          "lemon_squeezy_subscription_id": subscription.id.toString(),
          "plan_name": subscription.attributes.variant_name,
        });
        break;

      case 'subscription_cancelled':
      case 'subscription_expired':
      case 'subscription_paused':
        console.log(`Deactivating subscription for user: ${clerkUserId}`);
        await updateUserSubscription(userRecord.id, {
          "subscription_status": "cancelled", // Or map to a more specific status
        });
        break;
        
      default:
        console.log(`Received a webhook for an unhandled event: ${eventName}`);
        break;
    }
    
    // --- 7. Respond to Lemon Squeezy to confirm receipt ---
    return new Response('Webhook processed successfully.', { status: 200 });

  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response('Internal Server Error while processing webhook.', { status: 500 });
  }
}