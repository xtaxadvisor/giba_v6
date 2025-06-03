// netlify/functions/ask-jennifer.ts
import { Handler } from '@netlify/functions';
import { OpenAI } from 'openai';
import { createClient } from '@supabase/supabase-js';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const { user_id, content } = JSON.parse(event.body || '{}');

    if (!content || typeof content !== 'string') {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing or invalid content' })
      };
    }

    // Store the user message
    await supabase.from('conversations').insert({
      user_id,
      role: 'user',
      message: content
    });

    // Ask Jennifer (main assistant)
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are Jennifer, the professional and friendly assistant at ProTaxAdvisors. Help with tax, finance, booking, and onboarding tasks.' },
        { role: 'user', content }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const reply = completion.choices[0]?.message?.content;

    // If no reply, fallback to Ketryka
    const finalReply = reply || "Hi, I’m escalating your request to Ketryka.";

    // Store the assistant response
    await supabase.from('conversations').insert({
      user_id,
      role: reply ? 'assistant' : 'ketryka',
      message: finalReply
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ response: finalReply })
    };
  } catch (error: any) {
    console.error('ask-jennifer error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Internal Server Error' })
    };
  }
};