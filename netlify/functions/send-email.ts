export const handler = async (event) => {
  console.log("📨 Email request received");
  const { to, subject, html } = JSON.parse(event.body || '{}');

  if (!to || !subject || !html) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing required email fields' }),
    };
  }

  const resendApiKey = process.env.RESEND_API_KEY;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${resendApiKey}`,
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