// netlify/functions/send-email.ts
import type { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

// ✅ Secure Supabase admin client for logging or role-based logic
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Never expose this key on the client!
);

export const handler: Handler = async (event) => {
  console.log('📨 Email request received');

  try {
    const body = JSON.parse(event.body || '{}');
    const { to, subject, html, replyTo, sentBy, purpose } = body;

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

    // ✅ Optional: Log the email event to Supabase audit_logs table
    if (sentBy || purpose) {
      const { error: logError } = await supabaseAdmin.from('audit_logs').insert({
        event: 'email_sent',
        metadata: {
          to,
          subject,
          replyTo,
          sentBy: sentBy || 'anonymous',
          purpose: purpose || 'unspecified'
        }
      });
      if (logError) console.warn('⚠️ Failed to log email audit:', logError);
    }

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