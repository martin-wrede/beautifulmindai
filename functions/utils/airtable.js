// functions/utils/airtable.js

// Correct way to import the Airtable library.
// Make sure you have installed it: `npm install airtable`
import Airtable from 'airtable';

// This variable will hold our initialized Airtable base connection.
let base;

/**
 * Initializes the connection to your Airtable base. This must be called
 * at the beginning of any function that needs to talk to Airtable.
 * @param {object} config - Contains the API key and Base ID.
 * @param {string} config.apiKey - Your Airtable API key from secrets.
 * @param {string} config.baseId - Your Airtable Base ID from secrets.
 */
export function initAirtable(config) {
  // Only initialize once to improve performance or if base is not set up correctly.
  // In a serverless function, base might need to be re-initialized per invocation
  // if the environment is completely reset. However, for a single request context,
  // this check helps ensure we don't re-initialize unnecessarily within that context.
  if (!base || (base && base._apiKey !== config.apiKey) || (base && base._baseId !== config.baseId)) {
    Airtable.configure({ apiKey: config.apiKey }); // Configure the global Airtable object
    base = Airtable.base(config.baseId); // Get the base instance
  }
}

/**
 * Finds a user record in the 'Users' table by their unique Clerk ID.
 * @param {string} clerkId - The user's ID from Clerk (e.g., 'user_2abc...').
 * @returns {Promise<object|null>} The Airtable record object if found, otherwise null.
 */
export async function findUserByClerkId(clerkId) {
  if (!base) throw new Error("Airtable is not initialized. Call initAirtable first.");

  try {
    const records = await base('Users') // Assumes your table is named 'Users'
      .select({
        filterByFormula: `{clerk_id} = "${clerkId}"`, // Assumes you have a 'clerk_id' field
        maxRecords: 1,
      })
      .firstPage();
    return records.length > 0 ? records[0] : null;
  } catch (error) {
    console.error("Error finding user by Clerk ID in Airtable:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
}

/**
 * Updates a user's subscription details in the 'Users' table.
 * Used by the Lemon Squeezy webhook.
 * @param {string} recordId - The unique Airtable record ID (e.g., 'recAbc123...').
 * @param {object} fieldsToUpdate - An object containing the fields to change.
 * @returns {Promise<object>} The updated Airtable record.
 */
export async function updateUserSubscription(recordId, fieldsToUpdate) {
  if (!base) throw new Error("Airtable is not initialized. Call initAirtable first.");

  try {
    const updatedRecords = await base('Users').update([{ id: recordId, fields: fieldsToUpdate }]);
    return updatedRecords[0];
  } catch (error) {
    console.error("Error updating user subscription in Airtable:", error);
    throw error;
  }
}

/**
 * Saves a new chat message to the 'Chat_History' table.
 * @param {object} messageData - The data for the new chat message.
 * @param {string} messageData.clerkId - The ID of the user who sent the message.
 * @param {string} messageData.role - 'user' or 'assistant'.
 * @param {string} messageData.content - The text of the message.
 * @returns {Promise<object>} The newly created Airtable record.
 */
export async function saveChatMessage(messageData) {
    if (!base) throw new Error("Airtable is not initialized. Call initAirtable first.");

    try {
        // This assumes you have a 'Chat_History' table with these fields.
        const createdRecords = await base('Chat_History').create([
            {
                fields: {
                    'clerk_id': messageData.clerkId,
                    'role': messageData.role,
                    'content': messageData.content,
                    'timestamp': new Date().toISOString(),
                }
            }
        ]);
        return createdRecords[0];
    } catch (error) {
        console.error("Error saving chat message to Airtable:", error);
        throw error;
    }
}