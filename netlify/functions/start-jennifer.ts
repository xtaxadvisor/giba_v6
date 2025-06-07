// netlify/functions/start-jennifer.ts
import type { Handler } from '@netlify/functions';

const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': String('*'),
        'Access-Control-Allow-Headers': String('Content-Type'),
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Content-Type': '',
      },
      body: '',
    };
  }

  try {
    const mockClientSecret = process.env.JENNIFER_CLIENT_SECRET;

    if (!mockClientSecret) {
      throw new Error('JENNIFER_CLIENT_SECRET is not defined in environment variables.');
    }

    console.log('✅ Client secret generated successfully');

    return {
      statusCode: 200,
      headers: {
        'Content-Type': String('application/json'),
        'Access-Control-Allow-Origin': String('*'),
        'Access-Control-Allow-Headers': String('Content-Type'),
        'Access-Control-Allow-Methods': '',
      },
      body: JSON.stringify({ client_secret: mockClientSecret }),
    };
  } catch (err) {
    console.error('❌ Error generating client secret:', err);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': String('application/json'),
        'Access-Control-Allow-Origin': String('*'),
        'Access-Control-Allow-Headers': String('Content-Type'),
        'Access-Control-Allow-Methods': '',
      },
      body: JSON.stringify({
        error: 'Internal Server Error',
        message: 'Could not generate client secret for Jennifer.',
      }),
    };
  };
}

export { handler };