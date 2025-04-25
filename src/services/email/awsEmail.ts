import dotenv from 'dotenv';
dotenv.config();
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

export class AWSEmailService {
  private static instance: AWSEmailService;
  private readonly sesClient: SESClient;
  private readonly defaultSender = 'info@protaxadvisors.tax';

  private constructor() {
    this.sesClient = new SESClient({
      region: 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
      }
    });
  }

  public static getInstance(): AWSEmailService {
    if (!AWSEmailService.instance) {
      AWSEmailService.instance = new AWSEmailService();
    }
    return AWSEmailService.instance;
  }

  async sendEmail(to: string, subject: string, body: string, options: {
    html?: string;
    replyTo?: string;
    attachments?: Array<{ filename: string; content: Buffer }>;
  } = {}) {
    try {
      const command = new SendEmailCommand({
        Source: this.defaultSender,
        Destination: {
          ToAddresses: [to]
        },
        Message: {
          Subject: { Data: subject },
          Body: {
            Text: { Data: body },
            ...(options.html && { Html: { Data: options.html } })
          }
        },
        ...(options.replyTo && { ReplyToAddresses: [options.replyTo] })
      });

      await this.sesClient.send(command);
      return true;
    } catch (error) {
      console.error('Email sending error:', error);
      throw error;
    }
  }

  async sendBookingConfirmation(to: string, bookingDetails: {
    service: string;
    date: string;
    time: string;
    professional: string;
    price: number;
  }) {
    const subject = 'Booking Confirmation - ProTaXAdvisors';
    const html = `
      <h2>Booking Confirmation</h2>
      <p>Thank you for booking with ProTaXAdvisors. Here are your booking details:</p>
      <ul>
        <li>Service: ${bookingDetails.service}</li>
        <li>Date: ${bookingDetails.date}</li>
        <li>Time: ${bookingDetails.time}</li>
        <li>Professional: ${bookingDetails.professional}</li>
        <li>Price: $${bookingDetails.price.toFixed(2)}</li>
      </ul>
      <p>If you need to reschedule or cancel, please contact us at least 24 hours before your appointment.</p>
    `;

    return this.sendEmail(to, subject, '', { html });
  }
}

export const awsEmailService = AWSEmailService.getInstance();