import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, Database, TrendingUp, MessageSquare, BookOpen } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import type { AuthContextType } from '../../contexts/AuthContext';
import { useNotificationStore } from '../../lib/store';
import { startTransition } from 'react';

interface PortalButtonProps {
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
}

function PortalButton({ title, description, icon: Icon, path }: PortalButtonProps) {
  let user: AuthContextType['user'];
  let isAuthenticated: AuthContextType['isAuthenticated'];
  try {
    const auth = useAuth();
    user = auth.user;
    isAuthenticated = auth.isAuthenticated;
  } catch (err) {
    console.warn('useAuth called outside of AuthProvider');
    return null;
  }

  const { addNotification } = useNotificationStore();
  const navigate = useNavigate();

  const handleAccess = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: path } });
      return;
    }
    if (!user?.role) {
      addNotification('Authentication is still loading. Please try again shortly.', 'error');
      return;
    }
    startTransition(() => {
      navigate(path);
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="flex items-center mb-4">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
        <h3 className="ml-3 text-xl font-semibold text-gray-900">{title}</h3>
      </div>
      <p className="text-gray-600 mb-6">{description}</p>
      <Button variant="primary" onClick={handleAccess} className="w-full">
        Access Portal
      </Button>
    </div>
  );
}

export function PortalAccess() {
  const portals: PortalButtonProps[] = [
    {
      title: 'Client Portal',
      description: 'Access your documents and manage your financial information securely.',
      icon: Database,
      path: '/client',
    },
    {
      title: 'Professional Portal',
      description: 'Dedicated workspace for financial professionals.',
      icon: Users,
      path: '/professional',
    },
    {
      title: 'Investors Club Portal',
      description: 'Access investment tools and market insights.',
      icon: TrendingUp,
      path: '/investor',
    },
    {
      title: 'Student Portal',
      description: 'Access educational resources and financial learning materials.',
      icon: BookOpen,
      path: '/student',
    },
    {
      title: 'Admin Portal',
      description: 'Comprehensive system administration and management.',
      icon: Shield,
      path: '/admin',
    },
    {
      title: 'Secure Messaging',
      description: 'End-to-end encrypted communication platform.',
      icon: MessageSquare,
      path: '/messages',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {portals.map((portal) => (
        <PortalButton key={portal.path} {...portal} />
      ))}
    </div>
  );
}