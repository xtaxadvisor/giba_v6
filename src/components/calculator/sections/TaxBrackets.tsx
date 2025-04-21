import { Info } from 'lucide-react';
import { formatCurrency } from '../../../utils/format';

interface TaxBracket {
  rate: number;
  min: number;
  max?: number;
  tax: number;
}

interface TaxBracketsProps {
  brackets: TaxBracket[];
  income: number;
}

export function TaxBrackets({ brackets, income }: TaxBracketsProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Tax Brackets</h3>
        <div className="flex items-center text-sm text-gray-500">
          <Info className="h-4 w-4 mr-1" />
          Your Income: {formatCurrency(income)}
        </div>
      </div>

      <div className="space-y-4">
        {brackets.map((bracket, index) => {
          const isInBracket = income > bracket.min && (!bracket.max || income <= bracket.max);
          const width = Math.min(100, (income / (bracket.max || income) * 100));

          return (
            <div key={index} className="relative">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-900">{bracket.rate}%</span>
                <span className="text-gray-500">
                  {formatCurrency(bracket.min)} - {bracket.max ? formatCurrency(bracket.max) : 'Above'}
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isInBracket ? 'bg-blue-500' : 'bg-gray-400'
                  }`}
                  style={{ width: `${isInBracket ? width : 0}%` }}
                />
              </div>
              {isInBracket && (
                <div className="mt-1 text-sm text-blue-600">
                  Tax in this bracket: {formatCurrency(bracket.tax)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}