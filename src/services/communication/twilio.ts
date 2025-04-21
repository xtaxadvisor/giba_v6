import { TWILIO_CONFIG, validateTwilioConfig } from '../../config/twilio';

class TwilioService {
  private static instance: TwilioService;

  private constructor() {}

  public static getInstance(): TwilioService {
    if (!TwilioService.instance) {
      TwilioService.instance = new TwilioService();
    }
    return TwilioService.instance;
  }

  async sendSMS(to: string, message: string) {
    try {
      const response = await fetch('/.netlify/functions/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          to,
          message,
          accountSid: TWILIO_CONFIG.accountSid,
          authToken: TWILIO_CONFIG.authToken,
          from: TWILIO_CONFIG.phoneNumber
        })
      });

      if (!response.ok) throw new Error('Failed to send SMS');
      return await response.json();
    } catch (error) {
      console.error('SMS sending error:', error);
      throw error;
    }
  }

  async sendWhatsApp(to: string, message: string) {
    try {
      const response = await fetch('/.netlify/functions/send-whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: `whatsapp:${to}`,
          from: `whatsapp:${TWILIO_CONFIG.whatsappNumber}`,
          message,
          accountSid: TWILIO_CONFIG.accountSid,
          authToken: TWILIO_CONFIG.authToken
        })
      });

      if (!response.ok) throw new Error('Failed to send WhatsApp message');
      return await response.json();
    } catch (error) {
      console.error('WhatsApp sending error:', error);
      throw error;
    }
  }
}

export const twilioService = TwilioService.getInstance();