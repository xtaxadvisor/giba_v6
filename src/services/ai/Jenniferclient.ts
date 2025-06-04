// ✅ src/services/ai/JenniferClient.ts (Enhanced with logging, streaming, and signed upload support)

import { supabase } from '@/lib/supabase/client';

const API_ENDPOINT = '/.netlify/functions/ask-jennifer';

export const jenniferAI = {
  // ✅ 1. Stream OpenAI chat response token-by-token (experimental, use with SSE-capable endpoint)
  async streamResponse(prompt: string, onChunk: (chunk: string) => void): Promise<void> {
    const res = await fetch(`${API_ENDPOINT}/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    if (!res.body) throw new Error('Streaming failed. No response body.');
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: streamDone } = await reader.read();
      done = streamDone;
      const chunk = decoder.decode(value);
      onChunk(chunk);
    }
  },

  // ✅ 2. Upload file with signed URL support (for private buckets)
  async uploadPrivateFile(file: File, userId: string): Promise<string> {
    const path = `${userId}/${Date.now()}_${file.name}`;

    const { data: signedURLData, error: signedError } = await supabase.storage
      .from('documents')
      .createSignedUploadUrl(path);

    if (signedError || !signedURLData?.signedUrl) {
      console.error('🛑 Signed upload URL error:', signedError);
      throw new Error('Could not create signed upload URL');
    }

    const uploadRes = await fetch(signedURLData.signedUrl, {
      method: 'PUT',
      headers: { 'Content-Type': file.type },
      body: file,
    });

    if (!uploadRes.ok) {
      throw new Error('Failed to upload to signed URL');
    }

    const { data } = supabase.storage.from('documents').getPublicUrl(path);
    if (!data?.publicUrl) throw new Error('No public URL returned');
    return data.publicUrl;
  },

  // ✅ 3. Log user and assistant messages into ai_messages table
  async logMessage(params: {
    userId: string;
    role: 'user' | 'assistant';
    content: string;
    source?: string;
  }): Promise<void> {
    const { userId, role, content, source = 'chat' } = params;
    const { error } = await supabase.from('ai_messages').insert({
      user_id: userId,
      role,
      message: content,
      source,
    });

    if (error) console.error('🛑 Logging failed:', error.message);
  },
};