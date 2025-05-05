import { useState } from 'react';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { formatTimeAgo } from '../../../../utils/date';
import type { QueuedDocument } from '../../../../types/documents';
import { supabase } from '../../../../lib/supabase/client';

interface DocumentQueueProps {
  documents: QueuedDocument[];
  onProcessDocument: (id: string) => void;
}

export function DocumentQueue({ documents, onProcessDocument }: DocumentQueueProps) {
  const [localDocs, setLocalDocs] = useState(documents);

  const handleProcess = async (id: string) => {
    setLocalDocs((prev) =>
      prev.map((doc) =>
        doc.id === id ? { ...doc, status: 'processing' } : doc
      )
    );
    try {
      await onProcessDocument(id);
      toast.success('Document is being processed.');
    } catch (error) {
      toast.error('Failed to process document.');
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newDocs: QueuedDocument[] = [];
    for (const file of Array.from(files)) {
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(`queued/${Date.now()}_${file.name}`, file);

      if (error) {
        toast.error(`Failed to upload ${file.name}`);
      } else {
        toast.success(`${file.name} uploaded.`);
        newDocs.push({
          id: data.path,
          name: file.name,
          queuedAt: new Date().toISOString(),
          status: 'pending',
          steps: [], // Default value for steps
        });
      }
    }
    setLocalDocs((prev) => [...newDocs, ...prev]);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Document Queue</h2>
        <label className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm cursor-pointer">
          Upload Document
          <input
            type="file"
            multiple
            hidden
            onChange={handleUpload}
          />
        </label>
      </div>
      {localDocs.map((doc) => (
        <div key={doc.id} className="bg-white rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`p-2 rounded-full ${
              doc.status === 'pending' ? 'bg-yellow-100' :
              doc.status === 'processing' ? 'bg-blue-100' :
              doc.status === 'completed' ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {doc.status === 'pending' ? <Clock className="h-5 w-5 text-yellow-600" /> :
               doc.status === 'processing' ? <Clock className="h-5 w-5 text-blue-600" /> :
               doc.status === 'completed' ? <CheckCircle className="h-5 w-5 text-green-600" /> :
               <AlertCircle className="h-5 w-5 text-red-600" />}
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{doc.name}</h4>
              <p className="text-sm text-gray-500">Added {formatTimeAgo(doc.queuedAt)}</p>
            </div>
          </div>
          {doc.status === 'pending' && (
            <button
              onClick={() => handleProcess(doc.id)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Process Now
            </button>
          )}
        </div>
      ))}
    </div>
  );
}