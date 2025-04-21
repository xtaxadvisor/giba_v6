import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Stamp, 
  FileCheck, 
  ArrowLeft,
  Clock,
  ClipboardList,
  FileCode,
  Globe,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useNotificationStore } from '../../lib/store';

interface Service {
  title: string;
  description: string;
  price: string;
  duration: string;
  icon: React.ComponentType<{ className?: string }>;
  features: string[];
}

export default function SameDayServices() {
  const navigate = useNavigate();
  const { addNotification } = useNotificationStore();

  const services: Service[] = [
    // Personal Document Services
    {
      title: 'Personal Document Preparation',
      description: 'Professional assistance with personal document preparation and processing.',
      price: '$99',
      duration: '2-3 hours',
      icon: FileText,
      features: [
        'ITIN/Tax ID Applications',
        'Virtual Notarization',
        'Online Document Certification',
        'Work Permit Applications',
        'Document Translation Services'
      ]
    },
    {
      title: 'ITIN/Tax ID Applications',
      description: 'Expert assistance with ITIN and Tax ID applications and submissions.',
      price: '$149',
      duration: '24 hours',
      icon: FileCode,
      features: [
        'Application Preparation',
        'Document Review',
        'IRS Submission',
        'Status Tracking',
        'Support Services'
      ]
    },
    {
      title: 'Virtual Notarization',
      description: 'Convenient online notarization services for your documents.',
      price: '$49',
      duration: '1 hour',
      icon: Stamp,
      features: [
        'Online Document Verification',
        'Digital Certification',
        'Secure Processing',
        'Electronic Delivery',
        '24/7 Availability'
      ]
    },
    {
      title: 'Work Permit Applications',
      description: 'Comprehensive assistance with work permit applications and processing.',
      price: '$199',
      duration: '24 hours',
      icon: ClipboardList,
      features: [
        'Application Review',
        'Document Preparation',
        'Submission Support',
        'Status Tracking',
        'Follow-up Assistance'
      ]
    },
    {
      title: 'Document Translation',
      description: 'Professional translation services for all types of documents.',
      price: '$79/page',
      duration: '24 hours',
      icon: Globe,
      features: [
        'Multiple Languages Available',
        'Certified Translations',
        'Legal Document Translation',
        'Technical Translation',
        'Rush Service Available'
      ]
    },
    // Existing Services...
    {
      title: 'Good Standing Certificates',
      description: 'Obtain official certificates verifying your LLC\'s compliance with state regulations.',
      price: '$149',
      duration: '24 hours',
      icon: FileCheck,
      features: [
        'State Compliance Check',
        'Document Preparation',
        'Rush Processing',
        'Digital Delivery'
      ]
    },
    // ... rest of existing services
  ];

  const handleGetStarted = (service: Service) => {
    try {
      // Navigate to contact form with service details
      navigate('/contact', { 
        state: { 
          service: service.title,
          price: service.price,
          duration: service.duration
        }
      });
    } catch (error) {
      console.error('Navigation error:', error);
      addNotification(
        'Unable to process request. Please try again.',
        'error'
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          icon={ArrowLeft}
          onClick={() => navigate('/')}
          className="mb-8"
        >
          Back to Home
        </Button>

        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Same Day Services</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Professional business and personal document services with rapid turnaround
          </p>
          <div className="mt-6 inline-flex items-center px-4 py-2 bg-blue-50 rounded-full">
            <Clock className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-blue-600 font-medium">24-Hour Turnaround Available</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <service.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="ml-3 text-xl font-semibold text-gray-900">{service.title}</h3>
                </div>
                
                <p className="text-gray-600 mb-4 min-h-[48px]">{service.description}</p>
                
                <div className="flex items-center justify-between mb-6">
                  <span className="text-2xl font-bold text-blue-600">{service.price}</span>
                  <div className="flex items-center text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{service.duration}</span>
                  </div>
                </div>

                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-600">
                      <div className="h-1.5 w-1.5 bg-blue-600 rounded-full mr-2"></div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => handleGetStarted(service)}
                >
                  Get Started
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}