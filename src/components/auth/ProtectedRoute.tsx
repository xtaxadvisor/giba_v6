import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import type { UserRole } from '@/lib/auth/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ children, allowedRoles = [], fallback }: ProtectedRouteProps) {
  const { user, isAuthenticated, hydrated } = useAuth();
  const [delayPassed, setDelayPassed] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setDelayPassed(true), 300);
    return () => clearTimeout(timeout);
  }, []);

  if (import.meta.env.DEV) {
    console.log('[ProtectedRoute Debug]', {
      isAuthenticated,
      hydrated,
      user,
      allowedRoles,
    });
  }

  if (!hydrated || !delayPassed) {
    return (
      <>
        {fallback ?? (
          <div role="status" className="text-center text-gray-500 p-6">
            🔄 Checking access...
          </div>
        )}
      </>
    );
  }

  if (!user || !user.role) {
    if (import.meta.env.DEV) {
      console.warn('[ProtectedRoute] No user or user role found.');
    }
    return <Navigate to="/unauthorized" replace />;
  }

  const normalizedUserRole = user.role.toLowerCase();
  const normalizedAllowedRoles = allowedRoles.map(r => r.toLowerCase());

  const hasAccess =
    normalizedAllowedRoles.length === 0 ||
    normalizedAllowedRoles.includes(normalizedUserRole) ||
    normalizedUserRole === 'superadmin';

  if (!hasAccess) {
    if (import.meta.env.DEV) {
      console.warn('[ProtectedRoute] Access denied for role:', user.role);
    }
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
