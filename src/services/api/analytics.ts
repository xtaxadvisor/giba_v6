import { api } from '../api';

export interface AnalyticsMetrics {
  revenue: { value: number; change: number };
  clients: { value: number; change: number };
  responseTime: { value: number; change: number };
  satisfaction: { value: number; change: number };
}

export const analyticsService = {
  getAnalytics: (timeRange: string) =>
    api.get<AnalyticsMetrics>(`/analytics?timeRange=${encodeURIComponent(timeRange)}`),

  exportAnalytics: (timeRange: string) =>
    api.get<Blob>(`/analytics/export?timeRange=${encodeURIComponent(timeRange)}`, {
      // Ensure the library supports this option or configure it correctly
      // Handle response type explicitly if needed
      headers: { Accept: 'text/csv' }
    }),

  getRevenueData: (timeRange: string) =>
    api.get<Array<{ date: string; value: number }>>(`/analytics/revenue?timeRange=${encodeURIComponent(timeRange)}`),

  getClientGrowth: (timeRange: string) =>
    api.get<Array<{ date: string; value: number }>>(`/analytics/clients?timeRange=${encodeURIComponent(timeRange)}`)
};