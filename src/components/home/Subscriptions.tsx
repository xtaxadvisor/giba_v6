import { useNavigate } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';

const plans = [
  {
    id: 'basic',
    name: 'Basic Plan',
    description: 'Essential tax and financial services',
    price: 29.99,
    interval: 'month',
    features: [
      'Basic Tax Consultation',
      'Document Storage',
      'Email Support',
      'Basic Tax Calculator'
    ]
  },
  {
    id: 'professional',
    name: 'Professional Plan',
    description: 'Advanced features for growing needs',
    price: 49.99,
    interval: 'month',
    features: [
      'Everything in Basic',
      'Priority Support',
      'Advanced Tax Planning',
      'Video Consultations',
      'Advanced Analytics'
    ],
    isPopular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise Plan',
    description: 'Complete solution for businesses',
    price: 99.99,
    interval: 'month',
    features: [
      'Everything in Professional',
      'Dedicated Account Manager',
      'Custom Integrations',
      'Team Access',
      'API Access',
      'Custom Reports'
    ]
  }
];

export function Subscriptions() {
  const navigate = useNavigate();
  let isAuthenticated = false;

  try {
    isAuthenticated = useAuth().user !== null; // Assuming 'user' is a valid property in AuthContextType
  } catch (err) {
    console.error('Subscriptions must be used within an AuthProvider.', err);
    return null;
  }

  const handleSelectPlan = (planId: string) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/#pricing' } });
      return;
    }
    navigate('/dashboard/billing', { state: { selectedPlan: planId } });
  };

  return (
    <>
      <h1 className="sr-only">Pricing Plans</h1>
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">SUBSCRIPTIONS</h2>
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
                    onClick={() => handleSelectPlan(plan.id)}
                  >
                    Get Started
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

// Export as both named and default export
export default Subscriptions;