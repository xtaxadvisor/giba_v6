import { FileText, Download, Eye } from 'lucide-react';
import { Button } from '../ui/Button';

interface FormCardProps {
  id: string;
  name: string;
  description: string;
  year: string;
  category: string;
  onPreview: (id: string) => void;
  onDownload: (id: string) => void;
}

export function FormCard({
  id,
  name,
  description,
  year,
  category,
  onPreview,
  onDownload
}: FormCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start">
          <div className="p-2 bg-blue-50 rounded-lg">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
            <p className="text-gray-600 mt-1">{description}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">Tax Year: {year}</span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {category}
          </span>
        </div>
      </div>

      <div className="mt-6 flex justify-end space-x-3">
        <Button
          variant="outline"
          size="sm"
          icon={Eye}
          onClick={() => onPreview(id)}
        >
          Preview
        </Button>
        <Button
          variant="primary"
          size="sm"
          icon={Download}
          onClick={() => onDownload(id)}
        >
          Download
        </Button>
      </div>
    </div>
  );
}