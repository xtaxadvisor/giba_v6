import { Handler } from '@netlify/functions';
import { supabase } from '../../src/lib/supabase/client';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const handler: Handler = async (event, context) => {
  const authHeader = event.headers.authorization || event.headers.Authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Missing or invalid Authorization header' }),
      headers: corsHeaders,
    };
  }

  const token = authHeader.slice(7);
  const { data, error } = await supabase.auth.getUser(token);

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({
      token,
      user: data?.user ?? null,
      error,
    }),
  };
};

export { handler };