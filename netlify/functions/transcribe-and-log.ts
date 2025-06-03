// ✅ netlify/functions/transcribe-and-log.ts
import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

// 🔐 Supabase client with service role
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 🔐 OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { audioUrl, user_id } = body;

    if (!audioUrl || !user_id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing audioUrl or user_id' })
      };
    }

    // 1️⃣ Fetch and convert audio to File for Whisper
    const audioBlob = await fetch(audioUrl).then(r => r.blob());
    const file = new File([audioBlob], 'audio.webm', {
      type: 'audio/webm',
      lastModified: Date.now()
    });

    // 2️⃣ Transcribe with Whisper
    const transcription = await openai.audio.transcriptions.create({
      file,
      model: 'whisper-1',
      response_format: 'text'
    });

    const transcript = transcription as unknown as string;

    // 3️⃣ Get Jennifer's response
    const chatResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are Jennifer, a polite, professional tax assistant.' },
        { role: 'user', content: transcript }
      ],
      temperature: 0.7
    });

    const reply = chatResponse.choices[0]?.message?.content || 'No response';

    // 4️⃣ Summarize Jennifer's response
    const summaryResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'Summarize the following message for user confirmation.' },
        { role: 'user', content: reply }
      ],
      temperature: 0.5
    });

    const summary = summaryResponse.choices[0]?.message?.content || '';

    // 5️⃣ Insert into Supabase `conversations` table
    const { error } = await supabase.from('conversations').insert([
      {
        user_id,
        source: 'voice',
        original_text: transcript,
        assistant_reply: reply,
        summary,
        audio_url: audioUrl
      }
    ]);

    if (error) {
      console.error('❌ Supabase insert error:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to insert conversation log.' })
      };
    }

    // ✅ Done
    return {
      statusCode: 200,
      body: JSON.stringify({ transcript, reply, summary })
    };
  } catch (err: any) {
    console.error('🔥 Transcribe & Log error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || 'Unexpected Server Error' })
    };
  }
};