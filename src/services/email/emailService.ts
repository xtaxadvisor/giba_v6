import nodemailer from 'nodemailer';
import { useNotificationStore } from '../../lib/store';

class EmailService {
  private static instance: EmailService;
  private transporter: nodemailer.Transporter;

  private constructor() {
    this.transporter = nodemailer.createTransport({
      host: "email-smtp.us-east-1.amazonaws.com",
      port: 465,
      secure: true,
      auth: {
        user: import.meta.env.VITE_AWS_SMTP_USERNAME || "gilberto27601@protaxadvisors.tax",
        pass: import.meta.env.VITE_AWS_SMTP_PASSWORD || "Travelhere2024$"
      }
    });
  }

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  async sendEmail(to: string, subject: string, body: string, options: {
    html?: string;
    replyTo?: string;
    attachments?: Array<{ filename: string; content: Buffer }>;
  } = {}) {
    try {
      const info = await this.transporter.sendMail({
        from: import.meta.env.VITE_AWS_SMTP_FROM || 'info@protaxadvisors.tax',
        to,
        subject,
        text: body,
        html: options.html,
        replyTo: options.replyTo,
        attachments: options.attachments
      });

      console.log('Email sent:', info.messageId);
      return true;
    } catch (error) {
      console.error('Email sending error:', error);
      useNotificationStore.getState().addNotification(
        'Failed to send email. Please try again later.',
        'error'
      );
      throw error;
    }
  }

  async sendTestEmail() {
    return this.sendEmail(
      'test@example.com',
      'SMTP Test',
      'If you received this email, SMTP is working!',
      {
        html: '<h1>SMTP Test</h1><p>If you received this email, SMTP is working!</p>'
      }
    );
  }
}

export const emailService = EmailService.getInstance();