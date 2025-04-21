export interface AnalyticsInsight {
  type: 'positive' | 'negative' | 'warning';
  metric: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
}
// Define and export the PerformanceData type
export interface PerformanceData {
  label: string;
  current: number;
  history: Array<{ date: string; value: number }>;
}
export interface AIMetrics {
  totalInteractions: number;
  averageResponseTime: number;
  satisfactionRate: number;
  topQuestions: Map<string, number>;
  errorRate: number;
}
export interface Metric {
  name: string;
  value: number;
  unit: string;
  description: string;
  trend: 'up' | 'down' | 'stable';
  thresholds: {
    warning: number;
    critical: number;
  };
  comparison: {
    current: number;
    previous: number;
    absoluteChange: number;
    percentageChange: number;
    trend: 'up' | 'down' | 'stable';
  };
  analytics: {
    value: number;
    change: number;
    direction: 'up' | 'down' | 'stable';
    strength: 'strong' | 'moderate' | 'weak';
  };
  chartOptions: {
    aspectRatio?: number;
    smoothing?: boolean;
    fillGaps?: boolean;
    showLegend?: boolean;
    showTooltips?: boolean;
  };
  timeSeriesData: Array<{ date: string; value: number }>;
  color: string;
  history: Array<{ date: string; value: number }>;
  target: number;
  label: string;
  current: number;
  previous: number;
  targetValue: number;
    historyData: Array<{ date: string; value: number }>;
  }

export interface MetricData {
  label: string;
  current: number;
  previous: number;
  target: number;
  history: Array<{ date: string; value: number }>;
}

export interface TimeSeriesData {
  label: string;
  data: Array<{ date: string; value: number }>;
  color: string;
}
// Existing exports in the file
export type PerformanceMetrics = {
  [key: string]: {
    current: number;
    thresholds: {
      warning: number;
      critical: number;
    };
  };
};

// Exporting MetricThreshold type
export type MetricThreshold = {
  warning: number;
  critical: number;
};
export type SomeOtherType = { /* existing types */ };

export interface MetricComparison {
  current: number;
  previous: number;
  absoluteChange: number;
  percentageChange: number;
  trend: 'up' | 'down' | 'stable';
}
export interface AnalyticsTrend {
  value: number;
  change: number;
  direction: 'up' | 'down' | 'stable';
  strength: 'strong' | 'moderate' | 'weak';
}

export interface ChartOptions {
  aspectRatio?: number;
  smoothing?: boolean;
  fillGaps?: boolean;
  showLegend?: boolean;
  showTooltips?: boolean;
}
