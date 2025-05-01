import { randomUUID } from 'crypto';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
};
import { Handler } from '@netlify/functions';

const handler: Handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
      headers: corsHeaders,
    };
  }

  if (event.path?.endsWith('/threads')) {
    const thread = {
      id: randomUUID(),
      participants: ['userA', 'userB'],
      createdAt: new Date().toISOString(),
    };

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Thread created', data: thread }),
      headers: corsHeaders,
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    console.log('Received message:', body);

    const { recipientId, content, attachments } = body;

    if (!recipientId || !content) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'recipientId and content are required' }),
        headers: corsHeaders,
      };
    }

    // 🚀 This is where you would insert the message into a DB
    const fakeMessage = {
      id: randomUUID(),
      recipientId,
      content,
      attachments: attachments || [],
      createdAt: new Date().toISOString(),
    };

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Message received', data: fakeMessage }),
      headers: corsHeaders,
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error', detail: err.message }),
      headers: corsHeaders,
    };
  }
};

export { handler };