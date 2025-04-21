import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { threadService } from '../../services/api/threadService'; // Make sure this exists or I can generate it
// import type { Thread } from '@/types/messaging'; // Removed unused import
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
    }
  });

  const deleteThread = useMutation({
    mutationFn: threadService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['threads'] });
    }
  });

  return {
    threads,
    isLoading,
    isError,
    refetch,
    createThread: createThread.mutate,
    deleteThread: deleteThread.mutate,
    isCreating: createThread.status === 'pending',
    isDeleting: deleteThread.status === 'pending',
  };
}