import { useQuery } from '@tanstack/react-query';

export function useSystemStatus() {
  const { data: status, isLoading } = useQuery({
    queryKey: ['system-status'],

    refetchInterval: 60000 // Refresh every minute
  });

  return {
    status,
    isLoading
  };
}