// src/config/twilio.ts
export const TWILIO_CONFIG = {
  accountSid: process.env.TWILIO_ACCOUNT_SID || '',
  authToken : process.env.TWILIO_AUTH_TOKEN  || '',
  phoneNumber: process.env.TWILIO_PHONE_NUMBER || '',
  whatsappNumber: process.env.TWILIO_WHATSAPP_NUMBER || '',
  messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID || '',
};

export function validateTwilioConfig() {
  if (!TWILIO_CONFIG.accountSid || !TWILIO_CONFIG.authToken) {
    throw new Error('Twilio configuration is invalid.');
  }
}