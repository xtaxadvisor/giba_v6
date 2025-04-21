import { Lightbulb } from 'lucide-react';

interface TaxTip {
  title: string;
  description: string;
}

interface TaxTipsProps {
  income: number;
  filingStatus: string;
}

export function TaxTips({ income, filingStatus }: TaxTipsProps) {
  const getTips = (): TaxTip[] => {
    const tips: TaxTip[] = [];

    // Add general tips
    tips.push({
      title: 'Keep Good Records',
      description: 'Maintain detailed records of all income, expenses, and deductions throughout the year.'
    });

    // Add income-based tips
    if (income > 100000) {
      tips.push({
        title: 'Consider Retirement Contributions',
        description: 'Maximize your 401(k) or IRA contributions to reduce taxable income.'
      });
    }

    // Add filing status tips
    if (filingStatus === 'married_joint') {
      tips.push({
        title: 'Review Both Incomes',
        description: 'Consider tax implications of combined income and explore deductions available to married couples.'
      });
    }

    return tips;
  };

  const tips = getTips();

  return (
    <div className="bg-blue-50 rounded-lg p-6">
      <h3 className="flex items-center text-lg font-medium text-blue-900 mb-4">
        <Lightbulb className="h-5 w-5 mr-2" />
        Tax Saving Tips
      </h3>
      <div className="space-y-4">
        {tips.map((tip, index) => (
          <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
            <h4 className="text-sm font-medium text-gray-900">{tip.title}</h4>
            <p className="mt-1 text-sm text-gray-600">{tip.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}