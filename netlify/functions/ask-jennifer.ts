// netlify/functions/ask-jennifer.ts
import { Handler } from '@netlify/functions';
import { OpenAI } from 'openai';

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
    const { content } = JSON.parse(event.body || '{}');

    if (!content || typeof content !== 'string') {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing or invalid content' })
      };
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are Jennifer, the professional and friendly assistant at ProTaxAdvisors. Help with tax, finance, booking, and onboarding tasks.' },
        { role: 'user', content }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const reply = completion.choices[0]?.message?.content || 'No response generated';

    return {
      statusCode: 200,
      body: JSON.stringify({ response: reply })
    };
  } catch (error: any) {
    console.error('ask-jennifer error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Internal Server Error' })
    };
  }
};
