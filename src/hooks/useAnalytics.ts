import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../services/api/analytics';
import { useNotificationStore } from '../lib/store';

export interface newUsers {
  date: string;
  count: number;
}
export interface churnRate {
  date: string;
  rate: number;
}
export interface activeUsers {
  date: string;
  count: number;
  }
export interface totalUsers {
  date: string;
  count: number;
}
export interface revenueData {
  date: string;
  amount: number;
}
export interface clientGrowth {
  date: string;
  growth: number;
}
export interface performanceMetrics {
  date: string;
  metric: number;
}
export interface retentionRate {
  date: string;
  rate: number;
}
export interface revenue {
  date: string;
  amount: number;
}
export interface revenueByMonth {
  date: string;
  amount: number;
}
export interface transactions {
  date: string;
  count: number;
}
export interface transactionValue {
  date: string;
  amount: number;
  }
  export interface transactionCount {
  date: string;
  count: number;
  }
export interface refunds {
  date: string;
  amount: number;
}

export function useAnalytics(timeRange: string) {
  const { addNotification } = useNotificationStore();


  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['analytics-metrics', timeRange],
    queryFn: () => analyticsService.getAnalytics(timeRange)
  });

  const { data: revenueData, isLoading: revenueLoading } = useQuery({
    queryKey: ['revenue-data', timeRange],
    queryFn: () => analyticsService.getRevenueData(timeRange)
  });

  const { data: clientGrowth, isLoading: clientGrowthLoading } = useQuery({
    queryKey: ['client-growth', timeRange],
    queryFn: () => analyticsService.getClientGrowth(timeRange)
  });


  const exportAnalytics = async (format: 'pdf' | 'csv' | 'excel') => {
    try {
      const data = await analyticsService.exportAnalytics(`${timeRange}-${format}`);
      const blob = new Blob([data], { 
        type: format === 'csv' ? 'text/csv' : 
              format === 'excel' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' : 
              'application/pdf' 
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-report-${timeRange}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      addNotification('Analytics data exported successfully', 'success');
    } catch (error) {
      addNotification('Failed to export analytics data', 'error');
    }
  };

  return {
    metrics,
    revenueData,
    clientGrowth,
    // performanceMetrics is not defined as a value, so it is removed
    isLoading: metricsLoading || revenueLoading || clientGrowthLoading,
    exportAnalytics
  };
}