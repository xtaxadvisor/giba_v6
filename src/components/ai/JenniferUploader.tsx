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
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `uploads/${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from('jennifer-docs')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      addNotification('📂 File uploaded successfully', 'success');

      const { data: download } = supabase.storage.from('jennifer-docs').getPublicUrl(filePath);
      const summary = await jenniferAI.summarizeDocument(download.publicUrl);

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
      <input
        type="file"
        accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <Button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="w-full"
      >
        {uploading ? 'Uploading...' : 'Upload & Let Jennifer Analyze'}
      </Button>
    </div>
  );
}