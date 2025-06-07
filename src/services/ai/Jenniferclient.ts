// ✅ src/services/ai/JenniferClient.ts (Enhanced with logging, streaming, and signed upload support)
import { supabase } from '@/lib/supabase/client';

const API_ENDPOINT = '/.netlify/functions/ask-jennifer';

interface LogMessageParams {
  userId: string;
  role: 'user' | 'assistant';
  content: string;
  source?: string;
}

interface JenniferAI {
  uploadFileToStorage: (file: File, userId: string) => Promise<any>;
  summarizeDocument: (url: string) => Promise<any>;
  getResponse: (prompt: string) => Promise<any>;
  streamResponse: (prompt: string, onChunk: (chunk: string) => void) => Promise<void>;
  uploadPrivateFile: (file: File, userId: string) => Promise<string>;
  logMessage: (params: LogMessageParams) => Promise<void>;
}

export const jenniferAI: JenniferAI = {
  uploadFileToStorage: async (file: File, userId: string): Promise<any> => {
    // Not implemented placeholder
    console.warn('⚠️ uploadFileToStorage not implemented');
    return null;
  },

  summarizeDocument: async (url: string): Promise<any> => {
    // Not implemented placeholder
    console.warn('⚠️ summarizeDocument not implemented');
    return null;
  },

  getResponse: async (prompt: string): Promise<any> => {
    try {
      const res = await fetch(`${API_ENDPOINT}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.error('🛑 getResponse failed:', error);
      throw error;
    }
  },

  async streamResponse(prompt: string, onChunk: (chunk: string) => void): Promise<void> {
    try {
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
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          onChunk(chunk);
        }
        done = streamDone;
      }
    } catch (error) {
      console.error('🛑 streamResponse error:', error);
      throw error;
    }
  },

  async uploadPrivateFile(file: File, userId: string): Promise<string> {
    const path = `${userId}/${Date.now()}_${file.name}`;
    const fileType = file.type || 'application/octet-stream';

    const { data: signedURLData, error: signedError } = await supabase.storage
      .from('documents')
      .createSignedUploadUrl(path);

    if (signedError || !signedURLData?.signedUrl) {
      console.error('🛑 Signed upload URL error:', signedError);
      throw new Error('Could not create signed upload URL');
    }

    const uploadRes = await fetch(signedURLData.signedUrl, {
      method: 'PUT',
      headers: { 'Content-Type': fileType },
      body: file,
    });

    if (!uploadRes.ok) {
      console.error('🛑 Failed to upload to signed URL');
      throw new Error('Upload failed');
    }

    const { data } = supabase.storage.from('documents').getPublicUrl(path);
    if (!data?.publicUrl) {
      throw new Error('🛑 No public URL returned');
    }
    return data.publicUrl;
  },

  async logMessage(params: LogMessageParams): Promise<void> {
    const { userId, role, content, source = 'chat' } = params;

    const { error } = await supabase.from('ai_messages').insert({
      user_id: userId,
      role,
      message: content,
      source,
    });

    if (error) {
      console.error('🛑 Logging failed:', error.message);
    } else {
      console.info('✅ Message logged to ai_messages');
    }
  },
};