// netlify/functions/consultations.ts

import { Handler } from '@netlify/functions';
import { supabase } from '../src/lib/supabase/client';

export const handler: Handler = async () => {
  const { data, error } = await supabase
    .from('consultations')
    .select('*');

  if (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  };
};