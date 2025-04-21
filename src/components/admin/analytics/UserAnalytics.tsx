import { Card } from '../../ui/Card';
import { LineChart } from '../charts/LineChart';
import { useAnalytics } from '../../../hooks/useAnalytics';
import { LucideIcon } from 'lucide-react';
import { Key } from 'react';

export function UserAnalytics() {
  const status = [
    { title: 'Active Users', value: 1200, change: '+5%', icon: undefined },
    { title: 'New Signups', value: 300, change: '+10%', icon: undefined },
    { title: 'Churn Rate', value: '2%', change: '-1%', icon: undefined },
    { title: 'Revenue', value: '$12,000', change: '+15%', icon: undefined },
  ];

  useAnalytics('month');


  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {status
          .filter((stat: { title: Key | null | undefined }) => stat.title)
          .map((stat: { title: Key; value: string | number; change: string | undefined; icon: LucideIcon | undefined }) => (
            <Card
              key={stat.title.toString()}
              title={stat.title.toString()}
              value={stat.value}
              description={stat.change}
              icon={stat.icon}
            />
          ))}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">User Growth</h3>
        <LineChart />
      </div>
    </div>
  );
}