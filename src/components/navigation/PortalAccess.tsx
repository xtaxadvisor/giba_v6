import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, Database, TrendingUp, MessageSquare, BookOpen } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useNotificationStore } from '../../lib/store';
import { startTransition } from 'react';
import { supabase } from '../../lib/supabase/client';

export enum Role {
  Admin = 'admin',
  Superadmin = 'superadmin',
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
  [Role.Superadmin]: 'Super Admin',
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
  [Role.Superadmin]: Shield,
  [Role.Professional]: Users,
  [Role.Investor]: TrendingUp,
  [Role.Student]: BookOpen,
  [Role.Client]: Database,
  [Role.Guest]: MessageSquare,
  [Role.Unauthenticated]: MessageSquare,
  [Role.Loading]: MessageSquare,
};

interface PortalButtonProps {
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
  role: Role;
  currentUserRole?: Role;
}

function PortalButton({ title, description, icon: Icon, path, role, currentUserRole }: PortalButtonProps) {
  const { addNotification } = useNotificationStore();
  const navigate = useNavigate();
  const { user } = useAuth();

  const isActiveRole = currentUserRole === role;

  const handleAccess = () => {
    if (!user) {
      sessionStorage.setItem('fromPortal', path);
      navigate('/login');
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
    <div className={`${[Role.Admin, Role.Superadmin].includes(role) ? 'lg:col-span-1 w-full lg:w-1/2' : 'w-full'}`}>
      <div className={`bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group min-h-[180px] flex flex-col justify-between ${isActiveRole ? 'border-2 border-blue-600' : ''}`}>
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
    </div>
  );
}

export function PortalAccess() {
  const { user, hydrated } = useAuth();

  const [resolvedRole, setResolvedRole] = React.useState<Role | null>(null);

  React.useEffect(() => {
    if (!hydrated || !user || user.role) return;

    const fetchRole = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

      if (data?.role && Object.values(Role).includes(data.role)) {
        setResolvedRole(data.role as Role);
      }
    };

    fetchRole();
  }, [hydrated, user]);

  const isValidRole = (role: unknown): role is Role =>
    Object.values(Role).includes(role as Role);

  const userRole = isValidRole(user?.role)
    ? (user.role as Role)
    : isValidRole(resolvedRole)
    ? resolvedRole
    : user
    ? Role.Guest
    : Role.Unauthenticated;

  const portals: (PortalButtonProps & { allowedRoles: Role[] })[] = [
    {
      title: ROLE_LABELS[Role.Admin],
      description: 'PROCESSING.',
      icon: ROLE_ICONS[Role.Admin],
      path: '/admin',
      allowedRoles: [Role.Admin, Role.Superadmin],
      role: Role.Admin,
    },
    {
      title: ROLE_LABELS[Role.Superadmin],
      description: 'BOSS.',
      icon: ROLE_ICONS[Role.Superadmin],
      path: '/superadmin',
      allowedRoles: [Role.Superadmin],
      role: Role.Superadmin,
    },
    {
      title: ROLE_LABELS[Role.Professional],
      description: 'Professional Dashboard.',
      icon: ROLE_ICONS[Role.Professional],
      path: '/professional',
      allowedRoles: [Role.Professional, Role.Superadmin],
      role: Role.Professional,
    },
    {
      title: ROLE_LABELS[Role.Client],
      description: 'Access your Dashboard securely.',
      icon: ROLE_ICONS[Role.Client],
      path: '/client',
      allowedRoles: [Role.Client, Role.Superadmin],
      role: Role.Client,
    },
    {
      title: ROLE_LABELS[Role.Investor],
      description:'Access investment tools and market insights.',
      icon: ROLE_ICONS[Role.Investor],
      path: '/investor',
      allowedRoles: [Role.Investor, Role.Superadmin],
      role: Role.Investor,
    },
    {
      title: ROLE_LABELS[Role.Student],
      description: 'Access educational resources .',
      icon: ROLE_ICONS[Role.Student],
      path: '/student',
      allowedRoles: [Role.Student, Role.Superadmin],
      role: Role.Student,
    },
    {
      title: 'Secure Messaging',
      description: 'End-to-end encrypted communication platform.',
      icon: ROLE_ICONS[Role.Client],
      path: '/messages',
      allowedRoles: [
        Role.Client,
        Role.Professional,
        Role.Investor,
        Role.Student,
        Role.Admin,
        Role.Superadmin,
      ],
      role: Role.Client,
    },
  ];


  const visiblePortals = portals;

  console.log('user:', user);
  console.log('resolvedRole:', resolvedRole);
  console.log('hydrated:', hydrated);
  console.log('final userRole:', userRole);
  console.log('visiblePortals:', visiblePortals);

  const loadingNote = !hydrated ? (
    <div className="text-center text-gray-400 mb-4">Verifying your access...</div>
  ) : null;

  return (
    <section aria-label="Portal Access Options">
      {loadingNote}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Admin and Superadmin portals in a shared row */}
        <div className="flex flex-col gap-4 lg:flex-row lg:gap-4 lg:col-span-1">
          {visiblePortals
            .filter((p) => [Role.Admin, Role.Superadmin].includes(p.role))
            .map((portal) => (
              <PortalButton key={portal.path} {...portal} currentUserRole={userRole} />
            ))}
        </div>
        {/* All other portals */}
        {visiblePortals
          .filter((p) => ![Role.Admin, Role.Superadmin].includes(p.role))
          .map((portal) => (
            <PortalButton key={portal.path} {...portal} currentUserRole={userRole} />
          ))}
      </div>
    </section>
  );
}