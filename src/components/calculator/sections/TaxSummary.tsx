import { DollarSign, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';
import { formatCurrency } from '../../../utils/format';

interface TaxSummaryProps {
  income: number;
  deductions: number;
  taxableIncome: number;
  effectiveRate: number;
}

export function TaxSummary({ income, deductions, taxableIncome, effectiveRate }: TaxSummaryProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Tax Summary</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <DollarSign className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-gray-600">Total Income</span>
          </div>
          <span className="text-lg font-medium text-gray-900">{formatCurrency(income)}</span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <ArrowDown className="h-5 w-5 text-red-400 mr-2" />
            <span className="text-gray-600">Total Deductions</span>
          </div>
          <span className="text-lg font-medium text-gray-900">-{formatCurrency(deductions)}</span>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <ArrowUp className="h-5 w-5 text-green-400 mr-2" />
              <span className="text-gray-600">Taxable Income</span>
            </div>
            <span className="text-lg font-medium text-gray-900">{formatCurrency(taxableIncome)}</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <TrendingUp className="h-5 w-5 text-blue-400 mr-2" />
            <span className="text-gray-600">Effective Tax Rate</span>
          </div>
          <span className="text-lg font-medium text-gray-900">{effectiveRate.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
}