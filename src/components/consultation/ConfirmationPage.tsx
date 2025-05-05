import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export function ConfirmationPage() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const interval = setInterval(() => setCountdown((c) => c - 1), 1000);
    const timeout = setTimeout(() => {
      navigate('/client/consultations');
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <div className="p-10 text-center">
      <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
      <h1 className="text-2xl font-bold">Your consultation has been scheduled!</h1>
      <p className="mt-2 text-gray-600">We’ve sent you a confirmation email with the details.</p>
      <p className="mt-1 text-sm text-gray-500">Redirecting in {countdown} seconds...</p>
      <button
        onClick={() => navigate('/client/consultations')}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Back to Consultations
      </button>
    </div>
  );
}

export default ConfirmationPage;
