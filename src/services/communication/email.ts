
class EmailService {
  private static instance: EmailService;
  private readonly defaultFrom = 'info@protaxadvisors.tax';

  private constructor() {}

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  async sendEmail(to: string, subject: string, body: string, options: {
    html?: string;
    attachments?: Array<{ filename: string; content: Buffer }>;
    from?: string;
  } = {}) {
    try {
      const response = await fetch('/.netlify/functions/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to,
          from: options.from || this.defaultFrom,
          subject,
          body,
          html: options.html,
          attachments: options.attachments
        })
      });

      if (!response.ok) throw new Error('Failed to send email');
      return await response.json();
    } catch (error) {
      console.error('Email sending error:', error);
      throw error;
    }
  }

  async sendTemplate(to: string, templateId: string, templateData: Record<string, any>, options: {
    from?: string;
  } = {}) {
    try {
      const response = await fetch('/.netlify/functions/send-template-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to,
          from: options.from || this.defaultFrom,
          templateId,
          templateData
        })
      });

      if (!response.ok) throw new Error('Failed to send template email');
      return await response.json();
    } catch (error) {
      console.error('Template email sending error:', error);
      throw error;
    }
  }

  /**
   * Send a confirmation email to a user after they submit a form/message.
   */
  async sendUserConfirmation(name: string, to: string) {
    return this.sendEmail(
      to,
      'Thank you for contacting ProTaxAdvisors!',
      `Hello ${name},\n\nWe received your message and a professional will respond soon.`,
      {
        html: `<p>Hello ${name},</p><p>We received your message and a professional will respond soon.</p>`
      }
    );
  }

  /**
   * Send a confirmation email to a user using a template after form/message submission.
   */
  public async sendUserTemplateConfirmation(name: string, to: string) {
    return this.sendTemplate(
      to,
      'user-confirmation-template', // replace with actual template ID if needed
      { name }
    );
  }
}

export const emailService = EmailService.getInstance();

async function sendUserTemplateConfirmation(name: string, to: string) {
  try {
    await emailService.sendUserTemplateConfirmation(name, to);
    console.log(`Template confirmation email sent to ${to}`);
  } catch (error) {
    console.error(`Failed to send template confirmation email to ${to}:`, error);
    throw error;
  }
}
