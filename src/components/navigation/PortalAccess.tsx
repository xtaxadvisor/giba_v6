import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, Database, TrendingUp, MessageSquare, BookOpen } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { AuthContextType } from '../../contexts/AuthContext';
import { useNotificationStore } from '../../lib/store';
import { startTransition } from 'react';

export enum Role {
  Admin = 'admin',
  Professional = 'professional',
  Investor = 'investor',
  Student = 'student',
  Client = 'client',
  Guest = 'guest',
  Unauthenticated = 'unauthenticated',
  Loading = 'loading',
}

export const ROLE_LABELS: Record<Role, string> = {
  [Role.Admin]: 'Administrator',
  [Role.Professional]: 'Professional',
  [Role.Investor]: 'Investor',
  [Role.Student]: 'Student',
  [Role.Client]: 'Client',
  [Role.Guest]: 'Guest',
  [Role.Unauthenticated]: 'Unauthenticated',
  [Role.Loading]: 'Loading',
};

export const ROLE_ICONS: Record<Role, LucideIcon> = {
  [Role.Admin]: Shield,
  [Role.Professional]: Users,
  [Role.Investor]: TrendingUp,
  [Role.Student]: BookOpen,
  [Role.Client]: Database,
  [Role.Guest]: MessageSquare,
  [Role.Unauthenticated]: MessageSquare,
  [Role.Loading]: MessageSquare,
};

// Removed duplicate PortalAccess function
interface PortalButtonProps {
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
  role: Role;
  currentUserRole?: Role;
}

function PortalButton({ title, description, icon: Icon, path, role, currentUserRole }: PortalButtonProps) {
  let user: AuthContextType['user'] | null = null as AuthContextType['user'] | null;
  try {
    const auth = useAuth();
    user = auth.user;
  } catch (err) {
    console.warn('useAuth called outside of AuthProvider');
    return null;
  }

  const isActiveRole = currentUserRole === role;

  const { addNotification } = useNotificationStore();
  const navigate = useNavigate();

  const handleAccess = () => {
    const auth = useAuth();
    const user: AuthContextType['user'] | null = auth.user;

    if (!user) {
      navigate('/login', { state: { from: path } });
      return;
    }

    if (!('role' in user) || typeof user.role !== 'string') {
      addNotification('Authentication is still loading. Please try again shortly.', 'error');
      return;
    }

    startTransition(() => {
      navigate(path);
    });
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group ${isActiveRole ? 'border-2 border-blue-600' : ''}`}>
      <div className="flex items-center mb-4">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Icon className="h-6 w-6 text-blue-600 transition-transform group-hover:scale-110 duration-200" />
        </div>
        <h3 className="ml-3 text-xl font-semibold text-gray-900">{ROLE_LABELS[role]}</h3>
        {isActiveRole && (
          <span className="ml-auto inline-block bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full">
            Active Role
          </span>
        )}
      </div>
      <p className="text-gray-600 mb-6">{description}</p>
      <Button variant="primary" onClick={handleAccess} className="w-full">
        Access Portal
      </Button>
    </div>
  );
}
// Removed duplicate PortalAccess function

export function PortalAccess() {
  let user: AuthContextType['user'] | null;
  try {
    const auth = useAuth();
    user = auth.user;
  } catch (err) {
    console.warn('useAuth called outside of AuthProvider');
    return null;
  }

  const portals: (PortalButtonProps & { allowedRoles: Role[] })[] = [
    {
      title: ROLE_LABELS[Role.Admin],
      description: 'Comprehensive system administration and management.',
      icon: ROLE_ICONS[Role.Admin],
      path: '/admin',
      allowedRoles: [Role.Admin],
      role: Role.Admin,
    },
    {
      title: ROLE_LABELS[Role.Professional],
      description: 'Dedicated workspace for financial professionals.',
      icon: ROLE_ICONS[Role.Professional],
      path: '/professional',
      allowedRoles: [Role.Professional],
      role: Role.Professional,
    },
    {
      title: ROLE_LABELS[Role.Client],
      description: 'Access your documents and manage your financial information securely.',
      icon: ROLE_ICONS[Role.Client],
      path: '/client',
      allowedRoles: [Role.Client],
      role: Role.Client,
    },
    {
      title: ROLE_LABELS[Role.Investor],
      description: 'Access investment tools and market insights.',
      icon: ROLE_ICONS[Role.Investor],
      path: '/investor',
      allowedRoles: [Role.Investor],
      role: Role.Investor,
    },
    {
      title: ROLE_LABELS[Role.Student],
      description: 'Access educational resources and financial learning materials.',
      icon: ROLE_ICONS[Role.Student],
      path: '/student',
      allowedRoles: [Role.Student],
      role: Role.Student,
    },
    {
      title: 'Secure Messaging',
      description: 'End-to-end encrypted communication platform.',
      icon: ROLE_ICONS[Role.Client], // Using Client icon for messaging as a fallback
      path: '/messages',
      allowedRoles: [Role.Client, Role.Professional, Role.Investor, Role.Student, Role.Admin],
      role: Role.Client,
    },
  ];

  // Type guard to ensure only valid role strings are passed into includes()
  const isValidRole = (role: unknown): role is Role => Object.values(Role).includes(role as Role);

  // Debug logs to inspect user and role during rendering
  // eslint-disable-next-line no-console
  console.log('Current user:', user);
  // eslint-disable-next-line no-console
  console.log('user.role:', user?.role);

  const role = user?.role;

  if (!user || !role) {
    return (
      <div className="text-center text-gray-500 py-10">
        Loading your portals...
        <div className="mt-4">
          <button
            className="text-sm text-blue-600 hover:underline"
            onClick={() => window.location.reload()}
          >
            Reload Portals
          </button>
        </div>
      </div>
    );
  }

  if (!isValidRole(role)) {
    return (
      <div className="text-center text-red-500 py-10">
        Your role is not recognized. Please contact support.
        <div className="mt-4">
          <button
            className="text-sm text-blue-600 hover:underline"
            onClick={() => window.location.reload()}
          >
            Reload Portals
          </button>
        </div>
      </div>
    );
  }

  const visiblePortals = portals.filter((p) => p.allowedRoles.includes(role));

  return (
    <section aria-label="Portal Access Options">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visiblePortals.map((portal) => (
          <PortalButton
            key={portal.path}
            {...portal}
            currentUserRole={role}
          />
                  ))}
                </div>
              </section>
            );
          }
        