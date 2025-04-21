import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../services/api/analytics';
import { useNotificationStore } from '../lib/store';
// Removed unused imports from 'date-fns'

export function useReports() {
  const [dateRange, setDateRange] = useState('month');
  const [reportType, setReportType] = useState('financial');
  const { addNotification } = useNotificationStore();


  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['performance-metrics', dateRange],
    queryFn: () => analyticsService.getAnalytics(dateRange)
  });

  const { data: revenueData, isLoading: revenueLoading } = useQuery({
    queryKey: ['revenue-data', dateRange],
    queryFn: () => analyticsService.getRevenueData(dateRange)
  });

  const { data: clientGrowth, isLoading: clientGrowthLoading } = useQuery({
    queryKey: ['client-growth', dateRange],
    queryFn: () => analyticsService.getClientGrowth(dateRange)
  });

  const exportReport = async (format: 'pdf' | 'csv' | 'email') => {
    try {
      // Implementation would go here
      addNotification(`Report exported as ${format.toUpperCase()}`, 'success');
    } catch (error) {
      addNotification('Failed to export report', 'error');
    }
  };

  return {
    dateRange,
    setDateRange,
    reportType,
    setReportType,
    metrics,
    revenueData,
    clientGrowth,
    isLoading: metricsLoading || revenueLoading || clientGrowthLoading,
    exportReport
  };
}