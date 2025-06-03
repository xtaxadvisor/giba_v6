// ✅ netlify/functions/transcribe-and-log.ts
import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import { OpenAI } from 'openai';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const handler: Handler = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}');
    const { audioUrl, user_id } = body;
    if (!audioUrl || !user_id) throw new Error('Missing required fields');

    // 1️⃣ Transcribe the audio
    const transcriptionRes = await openai.audio.transcriptions.create({
      file: new File(
        [await fetch(audioUrl).then(r => r.blob())],
        'audio.webm',
        { type: 'audio/webm', lastModified: Date.now() }
      ),
      model: 'whisper-1',
      response_format: 'text'
    });

    const transcript = transcriptionRes as unknown as string;

    // 2️⃣ Get assistant response
    const aiResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are Jennifer, a polite, professional tax assistant.' },
        { role: 'user', content: transcript }
      ]
    });

    const reply = aiResponse.choices[0]?.message?.content || 'No response';

    // 3️⃣ Generate summary
    const summaryRes = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'Summarize the following message for user confirmation.' },
        { role: 'user', content: reply }
      ]
    });

    const summary = summaryRes.choices[0]?.message?.content || '';

    // 4️⃣ Insert to conversations table
    await supabase.from('conversations').insert([
      {
        user_id,
        source: 'voice',
        original_text: transcript,
        assistant_reply: reply,
        summary,
        audio_url: audioUrl
      }
    ]);

    return {
      statusCode: 200,
      body: JSON.stringify({ reply, summary })
    };
  } catch (err: any) {
    console.error('❌ Transcribe & Log error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
