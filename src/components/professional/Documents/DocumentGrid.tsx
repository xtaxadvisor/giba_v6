import { 
  FileText, 
  Download, 
  Trash2, 
  Share2, 
  History,
  Eye,
  MoreVertical,
  Clock
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { LoadingSpinner } from '../../ui/LoadingSpinner';
import { toast } from 'react-toastify';

export interface DocumentGridProps {
  documents: Array<{
    id: string;
    title: string;
    clientId: string;
    uploadedAt: string;
    updatedAt: string;
    createdAt: string;
    type: string;
    content: any;
    status: string;
    createdBy: string;
    updatedBy: string;
    tags?: string[];
  }>;
  isLoading: boolean;
  onDelete: (documentId: string) => void;
  onShare?: (documentId: string) => void; // Added onShare property
}

export function DocumentGrid({ documents, isLoading, onDelete, onShare }: DocumentGridProps) {
  if (isLoading) {
    return <LoadingSpinner />;
  }

  const handleView = (doc: typeof documents[number]) => {
    toast.info(`Viewing "${doc.title}" (Coming soon)`);
  };

  const handleDownload = (doc: typeof documents[number]) => {
    toast.info(`Downloading "${doc.title}"`);
  };

  const handleVersionHistory = (doc: typeof documents[number]) => {
    toast.info(`Version history for "${doc.title}"`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {documents.map((doc) => (
        <div key={doc.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-blue-500" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">{doc.title}</h3>
                  <p className="text-sm text-gray-500">{doc.type}</p>
                </div>
              </div>
              <div className="relative group">
                <Button
                  variant="ghost"
                  size="sm"
                  icon={MoreVertical}
                  className="text-gray-400 hover:text-gray-500"
                  aria-haspopup="true"
                  aria-expanded="false"
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg hidden group-hover:block group-focus:block">
                  <div className="py-1">
                    <button
                      onClick={() => handleView(doc)}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </button>
                    <button
                      onClick={() => handleDownload(doc)}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </button>
                    <button
                      onClick={() => onShare?.(doc.id)}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </button>
                    <button
                      onClick={() => handleVersionHistory(doc)}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                    >
                      <History className="h-4 w-4 mr-2" />
                      Version History
                    </button>
                    <button
                      className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full"
                      onClick={() => onDelete(doc.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {new Date(doc.uploadedAt).toLocaleDateString()}
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                  {doc.status}
                </span>
              </div>
            </div>

            {doc.tags && doc.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {doc.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}