export const handler = async (event) => {
  const { to, subject, text, html } = JSON.parse(event.body || '{}');

  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'info@protaxadvisors.tax',
      to,
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ Email send failed:', response.status, errorText);
    return {
      statusCode: response.status,
      body: JSON.stringify({ error: errorText }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Email sent successfully' }),
  };
};