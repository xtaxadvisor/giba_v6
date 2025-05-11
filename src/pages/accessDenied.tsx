import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function AccessDenied() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    console.warn('Redirected to Access Denied');
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center px-6">
      <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
      <p className="text-gray-700 mb-6">
        {user?.role
          ? `You are logged in as a "${user.role}", which does not have permission to access this page.`
          : 'You do not have permission to access this page.'}
      </p>
      <button
        onClick={() => navigate('/')}
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Go Home
      </button>
    </div>
  );
}