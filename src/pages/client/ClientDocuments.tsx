import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useNotificationStore } from '@/lib/store';

interface ClientDocumentsProps {
  clientId: string;
}

export function ClientDocuments({ clientId }: ClientDocumentsProps) {
  const [documents, setDocuments] = useState<{ name: string; size: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    if (!clientId) return;
    const fetchDocuments = async () => {
      setLoading(true);
      const { data, error } = await supabase.storage
        .from('client-documents')
        .list(`${clientId}/`, { limit: 100 });

      if (error || !data) {
        console.error('Error fetching documents:', error);
        setError('Failed to load documents.');
      } else {
        setDocuments(data.map((file) => ({ name: file.name, size: file.metadata?.size ?? 0 })));
      }
      setLoading(false);
    };

    fetchDocuments();
  }, [clientId]);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const { error } = await supabase.storage
      .from('client-documents')
      .upload(`${clientId}/${file.name}`, file, {
        upsert: true,
      });

    if (error) {
      setError('Upload failed.');
      addNotification('Failed to upload document.', 'error');
      return;
    }

    addNotification('Document uploaded successfully!', 'success');
    const fetchDocuments = async () => {
      setLoading(true);
      const { data, error } = await supabase.storage
        .from('client-documents')
        .list(`${clientId}/`, { limit: 100 });

      if (error || !data) {
        console.error('Error fetching documents:', error);
        setError('Failed to load documents.');
      } else {
        setDocuments(data.map((file) => ({ name: file.name, size: file.metadata?.size ?? 0 })));
      }
      setLoading(false);
    };
    fetchDocuments();
  };

  const handleDelete = async (fileName: string) => {
    const confirmDelete = confirm(`Delete ${fileName}?`);
    if (!confirmDelete) return;

    const { error } = await supabase.storage
      .from('client-documents')
      .remove([`${clientId}/${fileName}`]);

    if (error) {
      setError('Delete failed.');
      addNotification('Failed to delete document.', 'error');
      return;
    }

    setDocuments((prev) => prev.filter((file) => file.name !== fileName));
    addNotification('Document deleted successfully.', 'success');
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Client Documents</h2>
      <p>Client ID: {clientId}</p>
      <div className="mb-4">
        <input type="file" onChange={handleUpload} />
      </div>
      {loading ? (
        <p>Loading documents...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {documents.length === 0 ? (
            <li>No documents found.</li>
          ) : (
            documents.map((doc) => (
              <li key={doc.name} className="flex items-center justify-between">
                <span>{doc.name} ({(doc.size / 1024).toFixed(1)} KB)</span>
                <button
                  onClick={() => handleDelete(doc.name)}
                  className="text-sm text-red-500 hover:underline"
                >
                  Delete
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}