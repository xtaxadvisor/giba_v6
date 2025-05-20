

import { Handler } from '@netlify/functions';

const handler: Handler = async (event, context) => {
  if (event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'List of threads would go here' }),
    };
  }

  if (event.httpMethod === 'POST') {
    const body = JSON.parse(event.body || '{}');
    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'Thread created', data: body }),
    };
  }

  return {
    statusCode: 405,
    body: JSON.stringify({ error: 'Method Not Allowed' }),
  };
};

export { handler };