import { useState } from 'react';
import {
  User,
  FileText,
  MessageSquare,
  Clock,
  Edit,
  Trash2,
} from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

import { ClientInfo } from '@/components/professional/ClientProfile/ClientInfo';
import { ClientDocuments } from '@/pages/client/ClientDocuments';
import { ClientCommunication } from '@/pages/client/ClientCommunication';
import ClientForm from '@/pages/client/ClientForm';
import { ClientHistory } from '@/pages/client/ClientHistory'; // Update the path to the correct location

import { useClient } from '@/hooks/useClient';
import type { Client } from '@/types/client'; // optional, if using for typing

interface ClientProfileProps {
  clientId: string;
}

export function ClientProfile({ clientId }: ClientProfileProps) {
  const [activeTab, setActiveTab] = useState('info');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { client, isLoading, updateClient, deleteClient } = useClient(clientId);

  if (isLoading) return <LoadingSpinner />;
  if (!client) return <div className="p-4 text-red-600">Client not found</div>;

  const handleUpdateClient = async (data: Partial<Client>) => {
    await updateClient({ id: clientId, ...data });
    setIsEditModalOpen(false);
  };

  const handleDeleteClient = async (clientId: string) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        const response = await fetch(`/api/clients/${clientId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete client');
        }

        alert('Client deleted successfully');
        window.location.reload(); // Optionally replace with router navigation if needed
      } catch (error) {
        console.error('Error deleting client:', error);
        alert('An error occurred while deleting the client. Please try again.');
      }
    }
  };

  const tabs = [
    { id: 'info', label: 'Overview', icon: User },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'communication', label: 'Communication', icon: MessageSquare },
    { id: 'history', label: 'History', icon: Clock },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
          <p className="text-gray-500">{client.company}</p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            icon={Edit}
            aria-label="Edit Client Profile"
            onClick={() => setIsEditModalOpen(true)}
          >
            Edit Profile
          </Button>
          <Button
            variant="outline"
            icon={Trash2}
            className="text-red-600 hover:text-red-700"
            aria-label="Delete Client"
            onClick={() => handleDeleteClient(clientId)}
          >
            Delete Client
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px" aria-label="Client Profile Tabs">
            {tabs.length > 0 ? (
              tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`group inline-flex items-center px-6 py-4 border-b-2 font-medium text-sm ${
                    activeTab === id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  aria-current={activeTab === id ? 'page' : undefined}
                >
                  <Icon
                    className={`-ml-1 mr-2 h-5 w-5 ${
                      activeTab === id
                        ? 'text-blue-500'
                        : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                  {label}
                </button>
              ))
            ) : (
              <div className="px-6 py-4 text-gray-500">
                No tabs available.
              </div>
            )}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
        {activeTab === 'info' && client && <ClientInfo client={client} />}
{activeTab === 'documents' && clientId && <ClientDocuments clientId={clientId} />}
{activeTab === 'communication' && clientId && <ClientCommunication clientId={clientId} />}
{activeTab === 'history' && clientId && <ClientHistory clientId={clientId} />}
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Client Profile"
      >
        <ClientForm
          initialData={client}  // Pass the client data to the form 

          onSubmit={handleUpdateClient}
          onCancel={() => setIsEditModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
