import { useState } from 'react';
import { Calculator, Clock, Plus, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { calculateServicesCost, ServiceTypeKeys, ServiceRequest } from '../../utils/serviceCalculator';
import { formatCurrency } from '../../utils/format';
import { useNotificationStore } from '../../lib/store';

export function ServiceCalculator() {
  const [services, setServices] = useState<ServiceRequest[]>([{
    serviceType: ServiceTypeKeys.TAX_PLANNING,
    hours: 1,
    quantity: 1
  }]);
  const [result, setResult] = useState<any>(null);
  const { addNotification } = useNotificationStore();

  const handleAddService = () => {
    setServices([...services, { hours: 1, serviceType: 'tax_planning', quantity: 1 }]);
  };

  const handleRemoveService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const handleServiceChange = (index: number, field: keyof ServiceRequest, value: any) => {
    const updatedServices = [...services];
    updatedServices[index] = { ...updatedServices[index], [field]: value };
    setServices(updatedServices);
  };

  const handleCalculate = () => {
    try {
      // Validate inputs
      const invalidService = services.find(s => !s.hours || s.hours < 0);
      if (invalidService) {
        addNotification('Please enter valid hours for all services', 'error');
        return;
      }

      const cost = calculateServicesCost(services);
      setResult(cost);
      addNotification('Cost calculation completed', 'success');
    } catch (error) {
      console.error('Calculation error:', error);
      addNotification(
        error instanceof Error ? error.message : 'Failed to calculate cost',
        'error'
      );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Calculator className="h-6 w-6 text-blue-800 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Service Cost Calculator</h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          icon={Plus}
          onClick={handleAddService}
        >
          Add Service
        </Button>
      </div>

      <div className="space-y-6">
        {services.map((service, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium text-gray-900">Service {index + 1}</h3>
              {services.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Trash2}
                  onClick={() => handleRemoveService(index)}
                  className="text-red-600 hover:text-red-700"
                  aria-label={`Remove service ${index + 1}`}
                />
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Service Type"
                value={service.serviceType}
                onChange={(value) => handleServiceChange(index, 'serviceType', value)}
                options={[
                  { value: ServiceTypeKeys.TAX_PLANNING, label: 'Tax Planning' },
                  { value: ServiceTypeKeys.FINANCIAL_REVIEW, label: 'Financial Review' },
                  { value: ServiceTypeKeys.INVESTMENT_ADVISORY, label: 'Investment Advisory' },
                  { value: ServiceTypeKeys.BUSINESS_CONSULTING, label: 'Business Consulting' },
                  { value: ServiceTypeKeys.TAX_PREPARATION, label: 'Tax Preparation' }
                ]}
              />

              <Input
                type="number"
                label="Hours"
                icon={Clock}
                value={service.hours}
                onChange={(e) => handleServiceChange(index, 'hours', Number(e.target.value))}
                min="1"
                step="0.5"
                required
                aria-label="Service hours"
              />
            </div>
          </div>
        ))}

        <div className="flex justify-end">
          <Button
            variant="primary"
            icon={Calculator}
            onClick={handleCalculate}
          >
            Calculate Cost
          </Button>
        </div>

        {result && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Cost Breakdown</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-700">Base Price:</span>
                <span className="font-medium">{formatCurrency(result.details.basePrice)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-700">Hourly Charges:</span>
                <span className="font-medium">{formatCurrency(result.details.hourlyCharges)}</span>
              </div>

              {result.addons > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-700">Addons:</span>
                  <span className="font-medium">{formatCurrency(result.addons)}</span>
                </div>
              )}

              <div className="border-t border-gray-200 my-2 pt-2">
                <div className="flex justify-between">
                  <span className="text-gray-700">Subtotal:</span>
                  <span className="font-medium">{formatCurrency(result.subtotal)}</span>
                </div>
              </div>

              {result.discount > 0 && (
                <div className="flex justify-between text-green-700">
                  <span>Discount ({result.details.appliedDiscount.percentage}%):</span>
                  <span className="font-medium">-{formatCurrency(result.discount)}</span>
                </div>
              )}

              <div className="border-t border-gray-200 my-2 pt-2">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>{formatCurrency(result.total)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}