import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function ConfirmationPage() {
  useEffect(() => {
    console.log('ConfirmationPage loaded');
  }, []);
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/client/consultations');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="p-10 text-center">
      <h1 className="text-2xl font-bold">Your consultation has been scheduled!</h1>
      <p className="mt-2 text-gray-600">We’ve sent you a confirmation email with the details.</p>
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
