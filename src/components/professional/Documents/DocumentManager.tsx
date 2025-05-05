import { useState } from 'react';
import { 
  FileText, 
  Upload, 
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { DocumentGrid } from './DocumentGrid';
import { DocumentList } from '../../dashboard/DocumentList';
import { DocumentUpload } from './DocumentUpload';
import { DocumentFilters } from '../../dashboard/DocumentFilters';
import { Modal } from '../../ui/Modal';
import { useDocuments } from '@/hooks/useDocuments';

export function DocumentManager() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const {
    documents: rawDocuments,
    isLoading,
    filters,
    setFilters,
    uploadDocument,
    deleteDocument,
    shareDocument
  } = useDocuments();

  const documents = rawDocuments.map((doc) => ({
    id: doc.id,
    title: doc.title,
    clientId: 'default-client-id', // Replace with actual logic if needed
    uploadedAt: 'unknown', // Replace with actual logic if needed
    updatedAt: 'unknown', // Replace with actual logic if needed
    createdAt: 'createdAt' in doc ? String(doc.createdAt) : 'unknown',
    type: 'type' in doc ? String(doc.type) : 'unknown',
    content: 'content' in doc ? doc.content : null,
    status: 'status' in doc ? String(doc.status) : 'pending',
    createdBy: 'createdBy' in doc ? String(doc.createdBy) : 'system',
    updatedBy: 'updatedBy' in doc ? String(doc.updatedBy) : 'system',
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Document Management</h1>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            icon={viewMode === 'grid' ? FileText : FileText}
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? 'List View' : 'Grid View'}
          </Button>
          <Button
            variant="primary"
            icon={Upload}
            onClick={() => setIsUploadModalOpen(true)}
          >
            Upload Documents
          </Button>
        </div>
      </div>

      <DocumentFilters
        filters={filters}
        onFilterChange={setFilters}
      />

      {viewMode === 'grid' ? 
        <DocumentGrid
          documents={documents}
          isLoading={isLoading}
          onDelete={deleteDocument}
          onShare={shareDocument}
        /> 
        : 
        <DocumentList
          documents={documents}
          isLoading={isLoading}
          onDelete={deleteDocument}
          onShare={shareDocument}
        />
      }

      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload Documents"
      >
        <DocumentUpload
          onClose={() => setIsUploadModalOpen(false)}
          onUpload={(files) => {
            const documentsToUpload = Array.from(files).map((file) => ({
              title: file.name,
              clientId: 'default-client-id', // Replace with actual logic if needed
              type: file.type,
              content: file, // Assuming the file content is passed directly
            }));
            documentsToUpload.forEach((document) => {
              const reader = new FileReader();
              reader.onload = () => {
                const base64Content = reader.result as string;
                uploadDocument({ ...document, content: base64Content });
              };
              reader.readAsDataURL(document.content as File);
            });
          }}
        />
      </Modal>
    </div>
  );
}