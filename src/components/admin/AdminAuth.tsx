import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingSpinner } from '../ui/LoadingSpinner';

export function AdminAuth({ children }: { children: React.ReactNode }) {
  let user = null;
  let loading = false;

  try {
    const auth = useAuth();
    user = auth.user;
    loading = auth.loading;
  } catch (err) {
    console.error('AdminAuth must be used within an AuthProvider.', err);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-700">Authentication Unavailable</h2>
          <p className="text-sm text-gray-500 mt-2">Please reload or ensure AuthProvider is mounted.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  const location = useLocation();

  if (!user?.role || user.role !== 'admin') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}