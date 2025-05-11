import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface ClientAuthProps {
  children: React.ReactNode;
}

export function ClientAuth({ children }: ClientAuthProps) {
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate loading state or fetch user data
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  const hasAccess = user?.role === 'client' || user?.role === 'superadmin';

  if (!hasAccess) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
