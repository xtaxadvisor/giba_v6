import { randomUUID } from 'crypto';
import { supabase } from '../../src/lib/supabase/client';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
};
import { Handler } from '@netlify/functions';

const handler: Handler = async (event, context) => {
  if (event.httpMethod === 'GET') {
    const authHeader = event.headers.authorization || event.headers.Authorization;
    let userId: string | null = null;
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      const { data: user, error } = await supabase.auth.getUser(token);
      if (error) {
        return {
          statusCode: 401,
          body: JSON.stringify({ error: 'Unauthorized: Invalid token' }),
          headers: corsHeaders,
        };
      }
      userId = user?.user?.id ?? null;
    }

    if (!userId) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Unauthorized' }),
        headers: corsHeaders,
      };
    }

    const { data: threads, error } = await supabase
      .from('message_threads')
      .select('*')
      .contains('participants', [userId]);

    if (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to fetch threads', detail: error.message }),
        headers: corsHeaders,
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ threads }),
      headers: corsHeaders,
    };
  }

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

    let sender_id: string | null = null;
    const authHeader = event.headers.authorization || event.headers.Authorization;
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      const { data: user, error } = await supabase.auth.getUser(token);
      if (error) {
        return {
          statusCode: 401,
          body: JSON.stringify({ error: 'Unauthorized: Invalid token' }),
          headers: corsHeaders,
        };
      }
      sender_id = user?.user?.id ?? null;
    }

    let { recipientId, content, attachments } = body;

    if (!sender_id) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Unauthorized: sender_id could not be determined' }),
        headers: corsHeaders,
      };
    }

    if (!recipientId) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('assigned_professional_id')
        .eq('id', sender_id)
        .maybeSingle();

      if (profileError) {
        return {
          statusCode: 500,
          body: JSON.stringify({ error: 'Failed to fetch assigned professional', detail: profileError.message }),
          headers: corsHeaders,
        };
      }

      recipientId = profile?.assigned_professional_id ?? null;
    }

    if (!recipientId || !content) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'recipientId and content are required' }),
        headers: corsHeaders,
      };
    }

    // Find or create a thread between sender and recipient
    let thread_id: string | null = null;
    // Try to find an existing thread with these two participants (order-independent)
    const { data: existingThread } = await supabase
      .from('message_threads')
      .select('id, participants')
      .contains('participants', [sender_id, recipientId])
      .maybeSingle();
    if (existingThread && Array.isArray(existingThread.participants) && existingThread.participants.length === 2) {
      // Confirm both participants are present (order-agnostic)
      const participantsSet = new Set(existingThread.participants);
      if (participantsSet.has(sender_id) && participantsSet.has(recipientId)) {
        thread_id = existingThread.id;
      }
    }
    if (!thread_id) {
      // Create a new thread
      const { data: newThread, error: threadError } = await supabase
        .from('message_threads')
        .insert([{ participants: [sender_id, recipientId], created_at: new Date().toISOString() }])
        .select()
        .maybeSingle();
      if (threadError || !newThread) {
        return {
          statusCode: 500,
          body: JSON.stringify({ error: 'Failed to create/find message thread', detail: threadError?.message }),
          headers: corsHeaders,
        };
      }
      thread_id = newThread.id;
    }

    const { data: inserted, error } = await supabase
      .from('messages')
      .insert([
        {
          id: randomUUID(),
          sender_id,
          recipient_id: recipientId,
          content,
          attachments,
          created_at: new Date().toISOString(),
          thread_id,
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