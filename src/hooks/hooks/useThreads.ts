import { toast } from 'react-hot-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { threadService } from '../../services/api/threadService'; // Make sure this exists or I can generate it
import type { Thread } from '@/types/messaging'; // Ensure this path is correct and the type exists
export function useThreads() {
  const queryClient = useQueryClient();

  const {
    data: threads,
    isLoading,
    isError,
    refetch,
  } = useQuery({ queryKey: ['threads'], queryFn: threadService.getAll });

  const createThread = useMutation({
    mutationFn: threadService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['threads'] });
      toast.success('Thread created successfully');
    },
    onError: () => {
      toast.error('Failed to create thread');
    }
  });

  const deleteThread = useMutation({
    mutationFn: threadService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['threads'] });
      toast.success('Thread deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete thread');
    }
  });

  const updateThread = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Thread> }) => threadService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['threads'] });
      toast.success('Thread updated successfully');
    },
    onError: () => {
      toast.error('Failed to update thread');
    }
  });

  return {
    threads,
    isLoading,
    isError,
    refetch,
    createThread: createThread.mutate,
    deleteThread: deleteThread.mutate,
    updateThread: updateThread.mutate,
    isCreating: createThread.status === 'pending',
    isDeleting: deleteThread.status === 'pending',
    isUpdating: updateThread.status === 'pending',
  };
}