// netlify/functions/start-jennifer.ts
import type { Handler } from '@netlify/functions';

const handler: Handler = async () => {
  try {
    // 🔐 In the future, you might call OpenAI or another voice provider here
    const mockClientSecret = 'mock_client_secret_here';

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // ✅ CORS support
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ client_secret: mockClientSecret }),
    };
  } catch (err) {
    console.error('❌ Error generating client secret:', err);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal Server Error',
        message: 'Could not generate client secret for Jennifer.',
      }),
    };
  }
};

export { handler };