import { Check, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import type { SubscriptionPlan } from '../../types/subscription';

interface SubscriptionPlansProps {
  plans: SubscriptionPlan[];
  onSelectPlan: (plan: SubscriptionPlan) => void;
  currentPlanId?: string;
}

export function SubscriptionPlans({ plans, onSelectPlan, currentPlanId }: SubscriptionPlansProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Subscription Plans</h2>
        <p className="mt-4 text-xl text-gray-600">
          Choose the perfect plan for your needs
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative bg-white rounded-2xl shadow-xl ${
              plan.isPopular ? 'border-2 border-blue-500 scale-105' : ''
            }`}
          >
            {plan.isPopular && (
              <div className="absolute top-0 right-0 -translate-y-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
            )}
            
            <div className="p-8">
              <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
              <p className="mt-2 text-gray-500">{plan.description}</p>
              
              <div className="mt-4 flex items-baseline">
                <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                <span className="ml-1 text-gray-500">/{plan.interval}</span>
              </div>

              <ul className="mt-6 space-y-4">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mr-2" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant="primary"
                className="w-full mt-8"
                icon={ArrowRight}
                iconPosition="right"
                onClick={() => onSelectPlan(plan)}
                disabled={plan.id === currentPlanId}
              >
                {plan.id === currentPlanId ? 'Current Plan' : 'Select Plan'}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
