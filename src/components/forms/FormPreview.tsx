import React from 'react';
import { X, Download, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

interface FormPreviewProps {
  formId: string;
  onClose: () => void;
  onDownload: (id: string) => void;
}

export function FormPreview({ formId, onClose, onDownload }: FormPreviewProps) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const totalPages = 4; // Example value

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-gray-500 bg-opacity-75">
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
            <div className="w-screen max-w-4xl">
              <div className="flex h-full flex-col bg-white shadow-xl">
                <div className="flex items-center justify-between px-4 py-6 sm:px-6">
                  <h2 className="text-lg font-medium text-gray-900">Form Preview</h2>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-500">
                      Page {currentPage} of {totalPages}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={Download}
                      onClick={() => onDownload(formId)}
                    >
                      Download
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={X}
                      onClick={onClose}
                    />
                  </div>
                </div>
                
                <div className="relative flex-1 px-4 sm:px-6">
                  {/* Form preview content would go here */}
                  <div className="h-full bg-gray-100 rounded-lg"></div>
                </div>

                <div className="flex items-center justify-between px-4 py-4 sm:px-6 border-t border-gray-200">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={ArrowLeft}
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={ArrowRight}
                    iconPosition="right"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}