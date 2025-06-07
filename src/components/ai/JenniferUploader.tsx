// src/components/ai/JenniferUploader.tsx
import { useState } from 'react';
import { useNotificationStore } from '@/lib/store';
import { supabase } from '@/lib/supabase/client';
import { jenniferAI } from '@/services/ai/Jenniferclient';
import { Button } from '../ui/Button';

export function JenniferUploader({ onAnalysis }: { onAnalysis?: (summary: string) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { addNotification } = useNotificationStore();

  const handleUpload = async () => {
    if (!file) return;

    // ✅ Validate file type and size before upload
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!validTypes.includes(file.type)) {
      addNotification('⚠️ Unsupported file type.', 'error');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      addNotification('⚠️ File is too large. Max 10MB allowed.', 'error');
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `uploads/${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from('jennifer-docs')
        .upload(filePath, file, {
          contentType: file.type || 'application/octet-stream',
        });

      if (uploadError) throw uploadError;

      addNotification('📂 File uploaded successfully', 'success');

      const { data: download } = supabase.storage.from('jennifer-docs').getPublicUrl(filePath);
      if (!download?.publicUrl) throw new Error('Missing public URL for uploaded file.');

      let summary = '';
      addNotification('💡 Jennifer is analyzing your document...', 'info');

      await jenniferAI.streamResponse(download.publicUrl, (chunk: string) => {
        summary += chunk;
      });

      addNotification('✅ Analysis complete!', 'success');
      if (onAnalysis) onAnalysis(summary);
    } catch (err: any) {
      console.error('File upload failed:', err.message);
      addNotification('❌ Upload failed: ' + err.message, 'error');
    } finally {
      setUploading(false);
      setFile(null);
    }
  };

  return (
    <div className="mt-4 space-y-2">
      <label htmlFor="jennifer-upload" className="block text-sm font-medium text-gray-700">
        Upload a file to analyze
      </label>
      <input
        id="jennifer-upload"
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <Button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="w-full"
      >
        {uploading ? 'Uploading & Analyzing...' : 'Upload & Let Jennifer Analyze'}
      </Button>
    </div>
  );
}