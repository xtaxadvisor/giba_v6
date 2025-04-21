import React from 'react';


export interface Document {
  id: string;
  title: string;
  description?: string; // Added optional description property
}
export interface DocumentListProps {
  documents: Document[];
  onDelete: (id: string) => void;
  onShare: (id: string) => void;
  isLoading?: boolean; // Added isLoading prop
}

export const DocumentList: React.FC<DocumentListProps> = ({ documents }) => {
  if (!documents.length) {
    return <p className="text-gray-500">No documents available.</p>;
  }

  return (
    <ul className="space-y-3">
      {documents.map((doc) => (
        <li key={doc.id} className="p-4 border rounded shadow-sm bg-white">
          <h3 className="font-semibold">{doc.title}</h3>
          <p className="text-sm text-gray-600">{doc.description}</p>
        </li>
      ))}
    </ul>
  );
};