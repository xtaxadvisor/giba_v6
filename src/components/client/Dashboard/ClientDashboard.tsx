import { TrendingUp, AlertCircle, Calendar, FileText } from 'lucide-react';
import { Card } from '@/components/ui/Card'; // use alias if configured
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

interface ClientDashboardProps {
  title: string;
  description: string;
}

export const ClientDashboardHeader: React.FC<ClientDashboardProps> = ({ title, description }) => {
  return (
    <div>
      <h1>{title}</h1>
      <p>{description}</p>
      {/* Client Dashboard content */}
    </div>
  );
};
interface ClientDashboardProps {
  title: string;
  description: string;
}
// Removed duplicate ClientDashboard declaration to resolve redeclaration error
// Removed duplicate ClientDashboard function to resolve redeclaration error
export function ClientDashboard() {
  const healthScore = 85;

  const metrics = [
    { label: 'Savings', score: 92 },
    { label: 'Investments', score: 78 },
    { label: 'Tax Planning', score: 85 }
  ];

  const actionItems = [
    {
      icon: AlertCircle,
      title: 'Required Actions',
      value: '3',
      description: 'Tasks needing attention'
    },
    {
      icon: Calendar,
      title: 'Upcoming Deadlines',
      value: '2',
      description: 'In the next 30 days'
    },
    {
      icon: TrendingUp,
      title: 'Investment Growth',
      value: '+12.5%',
      description: 'Last 30 days'
    },
    {
      icon: FileText,
      title: 'Pending Documents',
      value: '5',
      description: 'Awaiting review'
    }
  ];

  const documents = [
    {
      title: 'Tax Return 2023',
      type: 'PDF',
      date: '2024-03-15',
      status: 'pending'
    },
    {
      title: 'W-2 Form',
      type: 'PDF',
      date: '2024-03-14',
      status: 'approved'
    },
    {
      title: 'Investment Statement',
      type: 'PDF',
      date: '2024-03-13',
      status: 'pending'
    }
  ];

  const [uploadedDocs, setUploadedDocs] = useState<{ name: string; size: number }[]>([]);
  const [loadingDocs, setLoadingDocs] = useState<boolean>(false);

  useEffect(() => {
    const fetchDocs = async () => {
      setLoadingDocs(true);
      const { data, error } = await supabase
        .storage
        .from('clientdocs')
        .list('', { limit: 100 });

      if (error) {
        console.error('Error fetching documents:', error.message);
        setLoadingDocs(false);
        return;
      }

      if (data) {
        setUploadedDocs(data.map((doc) => ({
          name: doc.name,
          size: doc.metadata?.size || 0
        })));
      }
      setLoadingDocs(false);
    };

    fetchDocs();
  }, []);

  const handleDelete = async (fileName: string) => {
    const confirmDelete = confirm(`Delete ${fileName}?`);
    if (!confirmDelete) return;

    const { error } = await supabase.storage
      .from('clientdocs')
      .remove([fileName]);

    if (error) {
      alert('Delete failed: ' + error.message);
      return;
    }

    setUploadedDocs((prev) => prev.filter((file) => file.name !== fileName));
  };

  return (
    <div className="space-y-6">
      {/* Financial Health Score */}
      <section className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Financial Health Score</h3>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded-full">
              <div
                className="h-4 bg-green-500 rounded-full"
                style={{ width: `${healthScore}%` }}
              />
            </div>
          </div>
          <span className="ml-4 text-2xl font-bold text-green-500">{healthScore}/100</span>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="text-center">
              <div className="text-sm font-medium text-gray-500">{metric.label}</div>
              <div className="text-lg font-semibold text-gray-900">{metric.score}/100</div>
            </div>
          ))}
        </div>
      </section>

      {/* Action Items */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {actionItems.map((item) => (
          <Card
            key={item.title}
            icon={item.icon}
            title={item.title}
            value={item.value}
            description={item.description}
          />
        ))}
      </section>

      {/* Document Timeline */}
      <section className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Documents</h3>
        <div className="space-y-4">
          {documents.map((doc, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center">
                <FileText className="h-4 w-4 text-gray-400 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">{doc.title}</p>
                  <p className="text-sm text-gray-500">
                    {doc.type} • {doc.date}
                  </p>
                </div>
              </div>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  doc.status === 'approved'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {doc.status}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Upload New Document */}
      <section className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Upload a Document</h3>
        <input
          type="file"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const filePath = `${Date.now()}_${file.name}`;
            supabase.storage
              .from('clientdocs')
              .upload(filePath, file)
              .then(({ error }) => {
                if (error) {
                  alert('Upload failed: ' + error.message);
                } else {
                  alert('Document uploaded successfully!');
                }
              });
          }}
          className="border border-gray-300 p-2 rounded w-full"
        />
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Uploaded Files</h4>
          {loadingDocs ? (
            <p>Loading documents...</p>
          ) : (
            <ul className="list-disc pl-6 text-sm text-gray-700">
              {uploadedDocs.length === 0 ? (
                <li>No documents uploaded yet.</li>
              ) : (
                uploadedDocs.map((file) => (
                  <li key={file.name} className="flex justify-between items-center">
                    <span>
                      {file.name} ({(file.size / 1024).toFixed(1)} KB)
                    </span>
                    <button
                      onClick={() => handleDelete(file.name)}
                      className="text-sm text-red-500 ml-4 hover:underline"
                    >
                      Delete
                    </button>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}