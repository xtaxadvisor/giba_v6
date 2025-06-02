import { Handler } from '@netlify/functions';
import axios from 'axios';

const handler: Handler = async (event, context) => {
  try {
    const config = {
      model: 'gpt-4o-realtime-preview',
      modalities: ['audio', 'text'],
      voice: 'coral',
      instructions: `You are Jennifer, the official assistant of ProTaxAdvisors. Your role is to support clients and team members by:
      - Explaining tax and accounting tasks in simple terms
      - Helping clients understand what documents they need to upload
      - Responding warmly and professionally to inquiries about services, pricing, scheduling, and deadlines
      - Managing booking flow
      - Following up on missing documents or forms
      - Helping organize tasks or communications for Giba
      - Speaking clearly and kindly, but never overstepping legal or financial boundaries`,
      temperature: 0.8,
      input_audio_format: 'pcm16',
      output_audio_format: 'pcm16',
      turn_detection: { type: 'semantic' }
    };

    const response = await axios.post(
      'https://api.openai.com/v1/realtime/sessions',
      config,
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        session: response.data.id,
        client_secret: response.data.client_secret.value
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};

export { handler };