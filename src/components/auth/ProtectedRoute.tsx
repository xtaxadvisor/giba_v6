import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import type { UserRole } from '@/lib/auth/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole[];
}
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}
export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth();

  const [delayPassed, setDelayPassed] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => setDelayPassed(true), 500);
    return () => clearTimeout(timeout);
  }, []);

  if (!user) {
    console.warn('[ProtectedRoute] No user context found.');
  }
  
  const normalizedUserRole = user?.role?.toLowerCase();
  const hasRoleAccess = isAuthenticated && (
    // If no specific roles required, allow any authenticated user
    !requiredRole?.length ||
    // Otherwise, check if user's role matches one of the required roles (or is superadmin)
    requiredRole.map(role => role.toLowerCase()).includes(normalizedUserRole ?? '') ||
    normalizedUserRole === 'superadmin'
  );

  if (import.meta.env.DEV) {
    console.log('[ProtectedRoute Debug]', {
      isAuthenticated,
      normalizedUserRole,
      requiredRole,
      hasRoleAccess,
    });
  }

  if (!delayPassed) {
    return <div className="text-center text-gray-500 p-6">Loading authentication...</div>;
  }

  if (!hasRoleAccess) {
    if (import.meta.env.DEV) {
      console.warn('[ProtectedRoute] Access denied for role:', user?.role);
    }
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
