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

  return {
    statusCode: response.ok ? 200 : response.status,
    body: JSON.stringify({ message: await response.text() }),
  };
};