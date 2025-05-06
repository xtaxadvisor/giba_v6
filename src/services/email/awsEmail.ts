import dotenv from 'dotenv';
dotenv.config();
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

export class AWSEmailService {
  private static instance: AWSEmailService;
  private readonly sesClient: SESClient;
  private readonly defaultSender = 'info@protaxadvisors.tax';

  private constructor() {
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      console.warn('AWS SES credentials are not defined in environment variables.');
    }
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
    cc?: string[];
    bcc?: string[];
  } = {}) {
    try {
      const destination: any = { ToAddresses: [to] };
      if (options.cc && options.cc.length > 0) {
        destination.CcAddresses = options.cc;
      }
      if (options.bcc && options.bcc.length > 0) {
        destination.BccAddresses = options.bcc;
      }

      const messageBody: any = { Text: { Data: body || ' ' } };
      if (options.html) {
        messageBody.Html = { Data: options.html };
      }

      const command = new SendEmailCommand({
        Source: this.defaultSender,
        Destination: destination,
        Message: {
          Subject: { Data: subject },
          Body: messageBody
        },
        ...(options.replyTo && { ReplyToAddresses: [options.replyTo] })
      });

      await this.sesClient.send(command);
      console.log('Email sent to:', to, 'Subject:', subject);
      // Optionally log this in Supabase:
      // await supabase.from('email_logs').insert([{ to, subject, timestamp: new Date().toISOString() }]);
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
        <li><strong>Service:</strong> ${bookingDetails.service}</li>
        <li><strong>Date:</strong> ${bookingDetails.date}</li>
        <li><strong>Time:</strong> ${bookingDetails.time}</li>
        <li><strong>Professional:</strong> ${bookingDetails.professional}</li>
        <li><strong>Price:</strong> $${bookingDetails.price.toFixed(2)}</li>
      </ul>
      <p>Please contact us at least 24 hours prior to reschedule or cancel.</p>
    `;

    return this.sendEmail(to, subject, '', { html });
  }

  async sendRescheduleNotice(to: string, details: {
    service: string;
    oldDate: string;
    newDate: string;
    professional: string;
  }) {
    const subject = 'Reschedule Notice - ProTaXAdvisors';
    const html = `
      <h2>Consultation Rescheduled</h2>
      <p>Your consultation has been rescheduled. Here are the updated details:</p>
      <ul>
        <li><strong>Service:</strong> ${details.service}</li>
        <li><strong>Old Date:</strong> ${details.oldDate}</li>
        <li><strong>New Date:</strong> ${details.newDate}</li>
        <li><strong>Professional:</strong> ${details.professional}</li>
      </ul>
      <p>If you need further changes, please contact our support team.</p>
    `;

    return this.sendEmail(to, subject, '', { html });
  }

  async sendCancellationNotice(to: string, details: {
    service: string;
    date: string;
    professional: string;
  }) {
    const subject = 'Consultation Cancelled - ProTaXAdvisors';
    const html = `
      <h2>Consultation Cancelled</h2>
      <p>The following consultation has been cancelled:</p>
      <ul>
        <li><strong>Service:</strong> ${details.service}</li>
        <li><strong>Date:</strong> ${details.date}</li>
        <li><strong>Professional:</strong> ${details.professional}</li>
      </ul>
      <p>Contact us if you have any questions or wish to reschedule.</p>
    `;

    return this.sendEmail(to, subject, '', { html });
  }
}

export const awsEmailService = AWSEmailService.getInstance();