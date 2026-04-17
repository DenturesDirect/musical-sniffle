import twilio from 'twilio';

// Use environment variables for all sensitive keys.
// Make sure TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER are available via dotenv or system env.
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromPhone = process.env.TWILIO_PHONE_NUMBER;

export const twilioClient = accountSid && authToken ? twilio(accountSid, authToken) : null;

/**
 * Sends an SMS text message using the default system Twilio integration.
 * @param to The target phone number (e.g. +16476085348)
 * @param body The contents of the SMS text message
 */
export async function sendSmsNotification(to: string, body: string) {
  if (!twilioClient) {
    console.warn("Twilio client is not initialized. Missing account credentials.");
    return false;
  }
  
  if (!fromPhone) {
    console.warn("Twilio sender phone number is missing.");
    return false;
  }

  try {
    const message = await twilioClient.messages.create({
      body,
      from: fromPhone,
      to,
    });
    console.log(`[Twilio] Successfully sent SMS notification to ${to}. SID: ${message.sid}`);
    return true;
  } catch (error) {
    console.error(`[Twilio] Error sending SMS to ${to}:`, error);
    return false;
  }
}
