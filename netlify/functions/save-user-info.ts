// netlify/functions/save-user-info.ts
import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const extractUserInfo = (text: string) => {
  const nameMatch = text.match(/my name is ([\w\s\-']+)/i);
  const emailMatch = text.match(/[\w\.-]+@[\w\.-]+\.\w+/);
  const phoneMatch = text.match(/\(?\d{3}[-.\s)]*\d{3}[-.\s]*\d{4}/);

  return {
    full_name: nameMatch?.[1]?.trim() ?? null,
    email: emailMatch?.[0] ?? null,
    phone: phoneMatch?.[0] ?? null
  };
};

export const handler: Handler = async (event) => {
  try {
    const { text } = JSON.parse(event.body || '{}');
    const user = extractUserInfo(text);

    if (!user.email || !user.full_name || !user.phone) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    const { error } = await supabase.from('profiles').upsert({
      full_name: user.full_name,
      email: user.email,
      phone: user.phone,
      verified: false
    }, { onConflict: 'email' });

    if (error) throw error;

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'User info saved successfully' })
    };
  } catch (err) {
    console.error('❌ save-user-info error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' })
    };
  }
};