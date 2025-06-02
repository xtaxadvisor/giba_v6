import { supabase } from '@/lib/supabase/client';

const API_ENDPOINT = '/api/ask-jennifer'; // ✅ Make sure this exists as a Netlify function

export const jenniferAI = {
  // ✅ Core AI response
  async getResponse(prompt: string): Promise<string> {
    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Jennifer failed to respond: ${errText}`);
      }

      const json = await response.json();
      return json?.reply || 'Sorry, I wasn\'t able to help with that.';
    } catch (err) {
      console.error('JenniferAI.getResponse error:', err);
      throw err;
    }
  },

  // ✅ Upload file to Supabase Storage
  async uploadFileToStorage(file: File, userId: string): Promise<string> {
    const path = `${userId}/${file.name}`;
    const { error } = await supabase.storage
      .from('documents')
      .upload(path, file, { upsert: true });

    if (error) {
      console.error('Upload error:', error.message);
      throw new Error('Failed to upload file');
    }

    const { data: publicUrlData } = supabase.storage
      .from('documents')
      .getPublicUrl(path);

    if (!publicUrlData?.publicUrl) {
      throw new Error('Could not generate public URL');
    }

    return publicUrlData.publicUrl;
  },

  // ✅ Summarize a document after upload
  async summarizeDocument(publicUrl: string): Promise<string> {
    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Summarize the following document and highlight any missing or incomplete sections:\n${publicUrl}`
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Failed to summarize document: ${errText}`);
      }

      const json = await response.json();
      return json?.reply || 'No summary was returned.';
    } catch (error) {
      console.error('summarizeDocument error:', error);
      throw error;
    }
  },

  // ✅ Check user’s missing docs
  async remindMissingDocuments(userId: string): Promise<string> {
    const { data, error } = await supabase
      .from('profiles')
      .select('missing_documents')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Missing docs fetch error:', error.message);
      return '⚠️ Unable to check for missing documents at this time.';
    }

    const docs = data?.missing_documents || [];
    if (docs.length === 0) {
      return '✅ All your required documents are submitted.';
    }

    return `📬 You’re still missing the following documents:\n- ${docs.join('\n- ')}\nPlease upload them to proceed.`;
  }
};