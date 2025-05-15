import { randomUUID } from 'crypto';
import { supabase } from '../../src/lib/supabase/client';
import { Handler } from '@netlify/functions';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const handler: Handler = async (event, context) => {
  const method = event.httpMethod;
  const authHeader = event.headers.authorization || event.headers.Authorization;

  // 🛡 Extract and validate Supabase token
  let userId: string | null = null;
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    const { data: user, error } = await supabase.auth.getUser(token);
    if (error || !user?.user?.id) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Unauthorized: Invalid token' }),
      };
    }
    userId = user.user.id;
  }

  if (!userId) {
    return {
      statusCode: 401,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Unauthorized: No user ID' }),
    };
  }

  // 🔄 Handle GET: return threads for this user
  if (method === 'GET') {
    const { data: threads, error } = await supabase
      .from('message_threads')
      .select('*')
      .contains('participants', [userId]);

    if (error) {
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Failed to fetch threads', detail: error.message }),
      };
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ threads }),
    };
  }

  // 🚫 Reject unsupported methods
  if (method !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: 'Method Not Allowed',
    };
  }

  // ✅ Handle POST message logic
  try {
    const body = JSON.parse(event.body || '{}');
    console.log('Received message body:', body);

    let { recipientId, content, attachments } = body;

    // 📌 If recipientId not provided, get from profile
    if (!recipientId) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('assigned_professional_id')
        .eq('id', userId)
        .maybeSingle();

      if (profileError) {
        return {
          statusCode: 500,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'Failed to fetch assigned professional', detail: profileError.message }),
        };
      }

      recipientId = profile?.assigned_professional_id ?? null;
    }

    if (!recipientId || !content) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'recipientId and content are required' }),
      };
    }

    // 🔄 Try to reuse thread if it already exists
    let thread_id: string | null = null;

    const { data: existingThread } = await supabase
      .from('message_threads')
      .select('id, participants')
      .contains('participants', [userId, recipientId])
      .maybeSingle();

    if (
      existingThread &&
      Array.isArray(existingThread.participants) &&
      existingThread.participants.length === 2 &&
      new Set(existingThread.participants).has(userId) &&
      new Set(existingThread.participants).has(recipientId)
    ) {
      thread_id = existingThread.id;
    }

    // 🔧 Create thread if none found
    if (!thread_id) {
      const { data: newThread, error: threadError } = await supabase
        .from('message_threads')
        .insert([{ participants: [userId, recipientId], created_at: new Date().toISOString() }])
        .select()
        .maybeSingle();

      if (threadError || !newThread) {
        return {
          statusCode: 500,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'Failed to create message thread', detail: threadError?.message }),
        };
      }

      thread_id = newThread.id;
    }

    // 💬 Insert message into DB
    const { data: inserted, error: messageError } = await supabase
      .from('messages')
      .insert([
        {
          id: randomUUID(),
          sender_id: userId,
          recipient_id: recipientId,
          content,
          attachments,
          created_at: new Date().toISOString(),
          thread_id,
        },
      ])
      .select()
      .maybeSingle();

    if (messageError) {
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Database insert failed', detail: messageError.message }),
      };
    }

    console.log('Message inserted:', inserted);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        status: 'success',
        message: 'Message stored successfully',
        payload: {
          thread_id,
          message: inserted,
        },
      }),
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Server error', detail: err.message }),
    };
  }
};

export { handler };