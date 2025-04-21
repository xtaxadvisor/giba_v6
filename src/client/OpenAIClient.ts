import OpenAI from 'openai';
import { OPENAI_CONFIG } from '@/config/openai';

export let openaiClient: OpenAI | null = null;

if (OPENAI_CONFIG?.apiKey) {
  openaiClient = new OpenAI({
    apiKey: OPENAI_CONFIG.apiKey,
    dangerouslyAllowBrowser: OPENAI_CONFIG.dangerouslyAllowBrowser,
    defaultHeaders: OPENAI_CONFIG.defaultHeaders
  });
}
