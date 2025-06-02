// src/components/ai/UploadDropzone.tsx
import { useRef, useState } from 'react';
import { jenniferAI } from '@/services/ai/Jenniferclient';
import { useNotificationStore } from '@/lib/store';

interface UploadDropzoneProps {
  onUploadComplete?: (summary: string) => void;
}

export function UploadDropzone({ onUploadComplete }: UploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const { addNotification } = useNotificationStore();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // Replace 'user-id-here' with the actual user ID from your auth context/store
      const userId = 'user-id-here';
      const publicUrl = await jenniferAI.uploadFileToStorage(file, userId);
      addNotification(`📂 ${file.name} uploaded`, 'success');

      const summary = await jenniferAI.summarizeDocument(publicUrl);
      if (onUploadComplete) onUploadComplete(summary);
    } catch (err) {
      console.error('Upload failed:', err);
      addNotification('❌ File upload or summary failed', 'error');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="mt-2 text-sm text-gray-700">
      <label className="cursor-pointer">
        📎 Upload a document
        <input
          type="file"
          ref={inputRef}
          className="hidden"
          onChange={handleFileChange}
          disabled={uploading}
        />
      </label>
      {uploading && <div className="mt-2 text-blue-600">Uploading & summarizing...</div>}
    </div>
  );
}