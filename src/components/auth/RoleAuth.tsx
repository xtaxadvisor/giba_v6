import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface RoleAuthProps {
  allowedRoles: string[]; // array of roles like ['admin', 'client']
  children: React.ReactNode;
}

export function RoleAuth({ allowedRoles, children }: RoleAuthProps) {
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(true);
  const location = useLocation();

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500); // simulate auth check
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  const hasAccess = user && user.role && allowedRoles.includes(user.role);

  if (!hasAccess) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}