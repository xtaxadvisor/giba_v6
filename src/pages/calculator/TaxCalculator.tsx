import { TaxCalculator as TaxCalculatorComponent } from '../../components/calculator/TaxCalculator';

export default function TaxCalculator() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TaxCalculatorComponent />
      </div>
    </div>
  );
}