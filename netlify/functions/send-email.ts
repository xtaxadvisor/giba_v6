// netlify/functions/send-email.ts
import type { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
  console.log('📨 Email request received');

  try {
    const body = JSON.parse(event.body || '{}');
    const { to, subject, html, replyTo } = body;

    if (!to || !subject || !html) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields: to, subject, or html' }),
      };
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.error('❌ Missing RESEND_API_KEY in environment');
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Server misconfiguration' }),
      };
    }

    const emailPayload: Record<string, any> = {
      from: 'info@protaxadvisors.tax',
      to,
      subject,
      html,
    };

    if (replyTo) {
      emailPayload.reply_to = replyTo;
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Resend email failed:', response.status, errorText);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: errorText }),
      };
    }

    const result = await response.json();
    console.log('✅ Email sent:', result);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Email sent successfully',
        data: result,
      }),
    };
  } catch (err: any) {
    console.error('🔥 Email handler error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || 'Unexpected server error' }),
    };
  }
};