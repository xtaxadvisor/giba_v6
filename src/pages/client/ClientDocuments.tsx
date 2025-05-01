import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

interface ClientDocumentsProps {
  clientId: string;
}
// Ensure this file exports the Documents component
export const Documents: React.FC = () => {
  return <div>Documents Component</div>;
};

export function ClientDocuments({ clientId }: ClientDocumentsProps) {
  const [documents, setDocuments] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!clientId) return;
    const fetchDocuments = async () => {
      setLoading(true);
      const { data, error } = await supabase.storage
        .from('client-documents')
        .list('', { limit: 100, offset: 0 });
      if (error) {
        console.error('Error fetching documents:', error);
        setError('Failed to load documents.');
      } else {
        setDocuments(data?.map((file) => file.name) || []);
      }
      setLoading(false);
    };

    fetchDocuments();
  }, [clientId]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Client Documents</h2>
      <p>Client ID: {clientId}</p>
      {loading ? (
        <p>Loading documents...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {documents.length === 0 ? (
            <li>No documents found.</li>
          ) : (
            documents.map((doc) => <li key={doc}>{doc}</li>)
          )}
        </ul>
      )}
    </div>
  );
}
export const ClientDocumentsList: React.FC = () => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Client Documents</h2>
      <p>This is where client documents will be listed and managed.</p>
    </div>
  );
}
export const ClientDocumentsDetails: React.FC = () => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Client Documents Details</h2>
      <p>This is where client documents details will be displayed.</p>
    </div>
  );
}