import { randomUUID } from 'crypto';
import { supabase } from '../../src/lib/supabase/client';

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

    const { data: inserted, error } = await supabase
      .from('messages')
      .insert([
        {
          id: randomUUID(),
          recipient_id: recipientId,
          content,
          attachments,
          created_at: new Date().toISOString(),
        }
      ])
      .select()
      .maybeSingle();

    if (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Database insert failed', detail: error.message }),
        headers: corsHeaders,
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Message stored', data: inserted }),
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

// Example client-side message sender:
/*
await fetch('/.netlify/functions/messages', {
  method: 'POST',
  body: JSON.stringify({
    content: message,
    recipientId: recipientId,
    attachments: attachments || []
  }),
  headers: { 'Content-Type': 'application/json' }
});
*/