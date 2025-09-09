// functions/api/webhooks/lemonsqueezy.js

import Airtable from 'airtable';
import { timingSafeEqual } from 'crypto';

/**
 * This function securely verifies the signature from the Lemon Squeezy webhook.
 * This is CRITICAL for security. Do not skip this.
 * @param {string} secret - Your LEMON_SQUEEZY_SIGNING_SECRET
 * @param {string} signature - The signature from the 'X-Signature' header
 * @param {string} rawBody - The raw, unparsed request body
 * @returns {boolean} - True if the signature is valid, false otherwise
 */
const verifySignature = (secret, signature, rawBody) => {
  if (!signature) {
    console.error("Signature header is missing.");
    return false;
  }
  
  const hmac = crypto.createHmac('sha256', secret);
  const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'hex');
  const signatureBuffer = Buffer.from(signature, 'hex');

  // Use timingSafeEqual to prevent timing attacks
  return signatureBuffer.length === digest.length && timingSafeEqual(digest, signatureBuffer);
};


export async function onRequestPost(context) {
  // --- 1. Get Secrets and Headers ---
  const signingSecret = context.env.LEMON_SQUEEZY_SIGNING_SECRET;
  const airtableApiKey = context.env.AIRTABLE_API_KEY;
  const airtableBaseId = context.env.AIRTABLE_BASE_ID; // You need to add this secret!
  
  if (!signingSecret || !airtableApiKey || !airtableBaseId) {
    console.error("Missing required environment variables.");
    return new Response('Server configuration error', { status: 500 });
  }

  const signature = context.request.headers.get('X-Signature');
  const rawBody = await context.request.text(); // Get the raw body as text

  // --- 2. Verify the Signature ---
  const isValid = verifySignature(signingSecret, signature, rawBody);
  if (!isValid) {
    console.warn("Invalid webhook signature received.");
    return new Response('Invalid signature', { status: 401 });
  }
  
  try {
    // --- 3. Parse the Data ---
    const payload = JSON.parse(rawBody);
    const eventName = payload.meta.event_name;
    const clerkUserId = payload.meta.custom_data?.clerk_user_id;
    const subscription = payload.data;

    if (!clerkUserId) {
      console.warn("Webhook received without a clerk_user_id in custom_data.");
      // Still return 200 OK so Lemon Squeezy doesn't retry.
      return new Response('Webhook processed, but no user ID found.', { status: 200 });
    }
    
    // --- 4. Connect to Airtable ---
    const base = new Airtable({ apiKey: airtableApiKey }).base(airtableBaseId);

    // --- 5. Find the User in Your Database ---
    const records = await base('Users') // Assuming your table is named 'Users'
      .select({
        filterByFormula: `{clerk_id} = "${clerkUserId}"`, // Assuming you have a 'clerk_id' field
        maxRecords: 1,
      })
      .firstPage();

    if (records.length === 0) {
      console.error(`Webhook received for unknown user: ${clerkUserId}`);
      return new Response('User not found', { status: 404 });
    }

    const userRecord = records[0];

    // --- 6. Handle Different Events (The Business Logic) ---
    switch (eventName) {
      case 'subscription_created':
      case 'subscription_resumed':
      case 'subscription_unpaused':
        console.log(`Activating subscription for user: ${clerkUserId}`);
        await base('Users').update(userRecord.id, {
          "subscription_status": "active",
          "lemon_squeezy_subscription_id": subscription.id,
          "plan_name": subscription.attributes.variant_name,
        });
        break;

      case 'subscription_cancelled':
      case 'subscription_expired':
      case 'subscription_paused':
        console.log(`Deactivating subscription for user: ${clerkUserId}`);
        await base('Users').update(userRecord.id, {
          "subscription_status": "cancelled", // or "expired", etc.
        });
        break;
        
      default:
        console.log(`Received unhandled event: ${eventName}`);
        break;
    }
    
    // --- 7. Respond to Lemon Squeezy ---
    return new Response('Webhook processed successfully', { status: 200 });

  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response('Internal Server Error', { status: 500 });
  }
}