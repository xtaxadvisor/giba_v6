import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as clientService from '../services/api/client';
import { useNotificationStore } from '../lib/store';

const CLIENT_KEY = 'client';
const CLIENTS_KEY = 'clients';

async function getById(clientId: string): Promise<any> {
  const response = await fetch(`/api/clients/${clientId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch client');
  }
  return response.json();
}

async function getAll(): Promise<any[]> {
  const response = await fetch('/api/clients');
  if (!response.ok) {
    throw new Error('Failed to fetch clients');
  }
  return response.json();
}

async function create(data: any): Promise<any> {
  const response = await fetch('/api/clients', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create client');
  }
  return response.json();
}

export async function deleteClient(clientId: string): Promise<void> {
  const response = await fetch(`/api/clients/${clientId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete client');
  }
}

export function useClient(clientId: string) {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();

  const { data: client, isLoading } = useQuery({
    queryKey: [CLIENT_KEY, clientId],
    queryFn: () => clientService.getById(clientId),
  });

  const updateClientMutation = useMutation({
    mutationFn: (data: any) => clientService.update(clientId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CLIENT_KEY, clientId] });
      addNotification('Client updated successfully', 'success');
    },
    onError: () => {
      addNotification('Failed to update client', 'error');
    },
  });

  const deleteClientMutation = useMutation({
    mutationFn: async (clientId: string): Promise<void> => {
      await clientService.deleteClient(clientId);
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: [CLIENT_KEY, id] });
      const previousClient = queryClient.getQueryData([CLIENT_KEY, id]);
      queryClient.setQueryData([CLIENT_KEY, id], (old: any) => ({
        ...old,
        deleted: true,
      }));
      return { previousClient };
    },
    onSettled: (id, _error, _variables, context) => {
      if (context?.previousClient && id) {
        queryClient.setQueryData([CLIENT_KEY, id], context.previousClient);
      } else if (id) {
        queryClient.invalidateQueries({ queryKey: [CLIENT_KEY, id] });
      }
      addNotification('Client deleted successfully', 'success');
    },
    onError: () => {
      addNotification('Failed to delete client', 'error');
    }
  });

  return {
    client,
    isLoading,
    updateClient: updateClientMutation.mutate,
    deleteClient: deleteClientMutation.mutate,
  };
}

export function useClients() {
  const { data, isLoading, error } = useQuery({
    queryKey: [CLIENTS_KEY],
    queryFn: () => clientService.getAll(),
  });

  const { addNotification } = useNotificationStore();
  const queryClient = useQueryClient();

  const createClientMutation = useMutation({
    mutationFn: (data: any) => clientService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CLIENTS_KEY] });
      addNotification('Client created successfully', 'success');
    },
    onError: () => {
      addNotification('Failed to create client', 'error');
    },
  });

  const updateClientMutation = useMutation({
    mutationFn: (data: any) => clientService.update(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CLIENTS_KEY] });
      addNotification('Client updated successfully', 'success');
    },
    onError: () => {
      addNotification('Failed to update client', 'error');
    },
  });

  const deleteClientMutation = useMutation({
    mutationFn: async (clientId: string) => clientService.deleteClient(clientId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CLIENTS_KEY] });
      addNotification('Client deleted successfully', 'success');
    },
    onError: () => {
      addNotification('Failed to delete client', 'error');
    },
  });

  return {
    clients: data,
    isLoading,
    error,
    createClient: createClientMutation.mutate,
    updateClient: updateClientMutation.mutate,
    deleteClient: deleteClientMutation.mutate,
  };
}