import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Chart } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);
import { formatCurrency } from '../../../utils/format';
// Removed incorrect import for PieChart

interface DeductionBreakdownProps {
  deductions: {
    standard: number;
    itemized: {
      mortgage: number;
      studentLoan: number;
      charitable: number;
      other: number;
    };
  };
  selectedType: 'standard' | 'itemized';
}

export function DeductionBreakdown({ deductions, selectedType }: DeductionBreakdownProps) {
  const itemizedTotal = Object.values(deductions.itemized).reduce((a, b) => a + b, 0);

  const data = {
    labels: ['Mortgage Interest', 'Student Loan Interest', 'Charitable Contributions', 'Other'],
    datasets: [{
      data: [
        deductions.itemized.mortgage,
        deductions.itemized.studentLoan,
        deductions.itemized.charitable,
        deductions.itemized.other
      ],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(251, 191, 36, 0.8)',
        'rgba(107, 114, 128, 0.8)'
      ]
    }]
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Deduction Analysis</h3>
      
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-sm text-gray-500">Standard Deduction</div>
          <div className="text-lg font-medium text-gray-900">{formatCurrency(deductions.standard)}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Itemized Total</div>
          <div className="text-lg font-medium text-gray-900">{formatCurrency(itemizedTotal)}</div>
        </div>
      </div>

      <div className="mb-6">
        <div className="text-sm font-medium text-gray-700 mb-2">
          Recommended Method: {' '}
          <span className="text-blue-600">
            {itemizedTotal > deductions.standard ? 'Itemized' : 'Standard'}
          </span>
        </div>
        <div className="text-sm text-gray-500">
          {itemizedTotal > deductions.standard
            ? `Itemizing saves you ${formatCurrency(itemizedTotal - deductions.standard)}`
            : `Standard deduction saves you ${formatCurrency(deductions.standard - itemizedTotal)}`}
        </div>
      </div>
          <Chart type="pie" data={data} />
      {selectedType === 'itemized' && (
        <div className="h-64">
          <Chart type="pie" data={data} />
        </div>
      )}
    </div>
  );
}