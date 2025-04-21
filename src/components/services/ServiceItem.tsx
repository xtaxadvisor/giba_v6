import { useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { consultationService } from "@/services/api/consultationService";
import { useNotificationStore } from '../../lib/store';

interface ServiceItemProps {
  title: string;
  description: string;
  price: string;
  features: string[];
  duration?: string;
}


export function ServiceItem({ title, description, price, features }: ServiceItemProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addNotification } = useNotificationStore();

  const handleGetStarted = async () => {
    try {
      if (!isAuthenticated) {
        navigate('/login', { 
          state: { 
            from: location.pathname,
            service: title 
          }
        });
        return;
      }

      // Ensure title exists and convert to URL-friendly format
      const serviceType = title ? title.toLowerCase().replace(/\s+/g, '-') : '';
      
      const redirectUrl = await consultationService.initiateConsultation(serviceType);
      
      if (redirectUrl) {
        navigate(redirectUrl);
      } else {
        navigate('/consultation/book', { 
          state: { serviceType }
        });
      }
    } catch (error) {
      console.error('Failed to initiate service:', error);
      addNotification('Failed to initiate service. Please try again.', 'error');
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-gray-600 text-sm min-h-[48px]">{description}</p>
      
      <div className="mt-4 text-2xl font-bold text-blue-600">
        {price}
      </div>
      
      <div className="my-6 border-t border-gray-100 pt-4">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start text-sm">
              <div className="h-1.5 w-1.5 bg-blue-600 rounded-full mr-2 mt-1.5"></div>
              <span className="text-gray-600">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-3">
        <Button
          variant="primary"
          className="w-full"
          icon={Calendar}
          onClick={handleGetStarted}
        >
          Get Started
        </Button>
      </div>
    </div>
  );
}