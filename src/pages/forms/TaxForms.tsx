import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

export default function TaxForms() {
  const navigate = useNavigate();

  const forms = [
    {
      id: 'form-1040',
      name: 'Form 1040',
      description: 'U.S. Individual Income Tax Return',
      year: '2023',
      category: 'Individual'
    },
    {
      id: 'form-1120',
      name: 'Form 1120',
      description: 'U.S. Corporation Income Tax Return',
      year: '2023',
      category: 'Business'
    },
    {
      id: 'form-1065',
      name: 'Form 1065',
      description: 'U.S. Return of Partnership Income',
      year: '2023',
      category: 'Business'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          icon={ArrowLeft}
          className="mb-8"
        >
          Back to Home
        </Button>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Tax Forms</h1>
          <p className="mt-4 text-xl text-gray-600">
            Access and download the tax forms you need
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {forms.map((form) => (
            <div
              key={form.id}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <h3 className="text-lg font-semibold text-gray-900">{form.name}</h3>
              <p className="text-gray-600 mt-2">{form.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-gray-500">Tax Year: {form.year}</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {form.category}
                </span>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <Button variant="outline" size="sm">
                  Preview
                </Button>
                <Button variant="primary" size="sm">
                  Download
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}