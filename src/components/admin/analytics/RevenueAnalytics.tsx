
import { DollarSign, TrendingUp, CreditCard, AlertCircle } from 'lucide-react';
import { Card } from '../../ui/Card';
import { BarChart } from '../charts/BarChart';
import { formatCurrency } from '../../../utils/format';
import { useAnalytics } from '../../../hooks/useAnalytics';

interface AnalyticsMetrics {
  revenue?: { value: number; change: number };
  transactions?: number;
  refunds?: number; // Added refunds property to the type
}

export function RevenueAnalytics() {
  const { metrics }: { metrics?: AnalyticsMetrics } = useAnalytics('month') ?? {}; // Explicitly type metrics with AnalyticsMetrics
  const revenue = Number(metrics?.revenue?.value ?? 0); // Extract the value from the revenue object
  // Removed unused 'growth' variable
  const transactions = metrics?.transactions ?? 0; // Safely check if transactions exist in metrics
  const refunds = metrics?.refunds ?? 0; // Extract the refunds metric from the metrics object returned by useAnalytics hook
  const profit = Number(revenue) - Number(refunds); // Ensure both revenue and refunds are numbers before subtraction

  const stats = [
    { title: 'Revenue', value: formatCurrency(revenue), change: `${metrics?.revenue?.change ?? 0}%`, icon: DollarSign },
    { title: 'Profit', value: formatCurrency(profit), change: '', icon: TrendingUp },
    { title: 'Transactions', value: transactions, change: '', icon: CreditCard },
    { title: 'Refunds', value: formatCurrency(refunds), change: '', icon: AlertCircle },
  ];
  

  

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            title={stat.title}
            value={stat.value}
            description={stat.change}
            icon={stat.icon}
          />
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Revenue</h3>
        <BarChart />
      </div>
    </div>
  );
}