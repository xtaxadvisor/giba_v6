import { supabase } from '@/lib/supabase/client';

const API_ENDPOINT = '/.netlify/functions/ask-jennifer'; // ✅ Netlify function endpoint

export const jenniferAI = {
  // 🔹 Get chat response from Jennifer AI
  async getResponse(prompt: string): Promise<string> {
    try {
      const res = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Jennifer failed to respond: ${errText}`);
      }

      const json = await res.json();
      return json?.reply || '⚠️ Jennifer was unable to generate a response.';
    } catch (err) {
      console.error('🛑 JenniferAI.getResponse error:', err);
      throw err;
    }
  },

  // 🔹 Upload file to Supabase Storage and return public URL
  async uploadFileToStorage(file: File, userId: string): Promise<string> {
    const path = `${userId}/${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(path, file, { upsert: true });

    if (uploadError) {
      console.error('🛑 Supabase upload error:', uploadError.message);
      throw new Error('Upload to storage failed');
    }

    const { data } = supabase.storage.from('documents').getPublicUrl(path);

    if (!data?.publicUrl) {
      throw new Error('Failed to generate public URL for uploaded file.');
    }

    return data.publicUrl;
  },

  // 🔹 Summarize document using OpenAI based on public URL
  async summarizeDocument(publicUrl: string): Promise<string> {
    try {
      const res = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `📄 Please summarize the document at this link and highlight any incomplete or missing sections:\n\n${publicUrl}`
        })
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Summarization failed: ${errText}`);
      }

      const json = await res.json();
      return json?.reply || '⚠️ No summary could be generated.';
    } catch (err) {
      console.error('🛑 summarizeDocument error:', err);
      throw err;
    }
  },

  // 🔹 Remind user about missing documents from Supabase
  async remindMissingDocuments(userId: string): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('missing_documents')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('🛑 Missing documents fetch error:', error.message);
        return '⚠️ Could not retrieve your missing documents.';
      }

      const docs: string[] = data?.missing_documents || [];

      if (docs.length === 0) {
        return '✅ All required documents are submitted.';
      }

      return `📬 You’re missing the following documents:\n- ${docs.join('\n- ')}\nPlease upload them to complete your file.`;
    } catch (err) {
      console.error('🛑 remindMissingDocuments error:', err);
      return '⚠️ Document check failed.';
    }
  }
};