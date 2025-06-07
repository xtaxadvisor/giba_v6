/// <reference types="node" />
import { Handler } from '@netlify/functions';
import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

interface RequestBody {
  prompt?: string;
}

const handler: Handler = async (event, context) => {
  try {
    const { prompt }: RequestBody = JSON.parse(event.body || '{}');

    if (!prompt || typeof prompt !== 'string') {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing or invalid prompt' }),
      };
    }

    const stream = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      stream: true,
      messages: [{ role: 'user', content: prompt }],
    });

    let body = '';
    for await (const chunk of stream) {
      const token = chunk.choices?.[0]?.delta?.content || '';
      body += token;
    }

    if (!body) {
      body = '⚠️ No response generated.';
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
      },
      body,
    };
  } catch (error: any) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Internal Server Error' }),
    };
  }
};

export default handler;