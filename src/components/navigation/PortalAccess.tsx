import React from 'react';
import { ShieldCheck } from 'lucide-react';
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
  Messaging = 'messaging',
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
  [Role.Messaging]: 'Messaging Portal',
};

// Ensure ROLE_ICONS is declared before use in portals
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
  [Role.Messaging]: ShieldCheck,
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
    <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col justify-between h-full min-h-[280px] transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
      <div>
        <div className="flex items-center mb-4">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Icon className="h-4 w-4 text-blue-600 transition-transform group-hover:scale-110 duration-200" />
          </div>
          <h3 className="ml-3 text-xl font-semibold text-gray-900">{ROLE_LABELS[role]}</h3>
          {isActiveRole && (
            <span className="ml-auto inline-block bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full">
              Active Role
            </span>
          )}
        </div>
        <div className="flex-grow">
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
      <div className="mt-auto">
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

  const isValidRole = (role: unknown): role is Role =>
    Object.values(Role).includes(role as Role);

  React.useEffect(() => {
    if (!hydrated || !user || isValidRole(user.role)) return;

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
        title: ROLE_LABELS[Role.Guest],
        description: 'Access public resources.',
        icon: ROLE_ICONS[Role.Guest],
        path: '/guest',
        allowedRoles: [Role.Guest],
        role: Role.Guest,
      },
       
    {
      title: ROLE_LABELS[Role.Messaging],
      description: 'End-to-end communication platform.',
      icon: ROLE_ICONS[Role.Messaging],
      path: '/messaging',
      allowedRoles: [
        Role.Client,
        Role.Professional,
        Role.Investor,
        Role.Student,
        Role.Admin,
        Role.Superadmin,
      ],
      role: Role.Messaging ,
    },
  ];


  const visiblePortals =
    userRole === Role.Unauthenticated || userRole === Role.Guest
      ? portals
      : portals.filter((portal) => portal.allowedRoles.includes(userRole));

  console.log('user:', user);
  console.log('resolvedRole:', resolvedRole);
  console.log('hydrated:', hydrated);
  console.log('final userRole:', userRole);
  console.log('visiblePortals:', visiblePortals);

  const loadingNote = !hydrated ? (
    <div className="text-center text-gray-400 mb-4">Verifying your access...</div>
  ) : null;

  return (
    <section aria-label="Portal Access Options" className="px-4 sm:px-6 lg:px-8">
      {loadingNote}
      <div className="max-w-7xl mx-auto">
        {visiblePortals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {visiblePortals.map((portal) => (
              <PortalButton key={portal.path} {...portal} currentUserRole={userRole} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-10">
            No portals available for your role.
          </div>
        )}
      </div>
    </section>
  );
}