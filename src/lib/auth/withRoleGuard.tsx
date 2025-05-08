import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useNotificationStore } from '@/lib/store';

export function withRoleGuard(Component: React.ComponentType, allowedRoles: string[]) {
  return function RoleProtectedComponent(props: any) {
    const { user, profile } = useAuth();
    const navigate = useNavigate();
    const { addNotification } = useNotificationStore();

    useEffect(() => {
      if (!user || !profile) return;

      if (!allowedRoles.includes(profile.role)) {
        addNotification('You are not authorized to access this page.', 'error');
        navigate('/');
      }
    }, [user, profile]);

    return <Component {...props} />;
  };
}