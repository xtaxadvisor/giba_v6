// /src/services/ai/client.ts (Final Jennifer AI Client)
import { supabase } from '@/lib/supabase/client';

export const jenniferAI = {
  async getResponse(prompt: string): Promise<string> {
    const res = await fetch('/api/ask-jennifer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content: prompt })
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || 'Failed to get AI response');
    }

    const data = await res.json();
    return data.response;
  }
};