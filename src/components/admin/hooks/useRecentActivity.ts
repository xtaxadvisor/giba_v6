import { useQuery } from '@tanstack/react-query';

export function useRecentActivity() {
  const { data: activities, isLoading } = useQuery({
    queryKey: ['recent-activity'],
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  return {
    activities,
    isLoading
  };
}