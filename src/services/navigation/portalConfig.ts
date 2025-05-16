import { Shield, TrendingUp, MessageSquare, BookOpen, User, ShieldCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface PortalConfig {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
  requiredRole?: string[];
  features: string[];
  notifications?: boolean;
  messaging?: boolean;
  documents?: boolean;
  subFeatures?: string[];
  role?: string;
  subFeatureDescriptions?: string[];
  allowedRoles?: string[];
}

export const PORTAL_CONFIGS: Record<string, PortalConfig> = {
  admin: {
    id: 'admin',
    title: 'Admin Portal',
    description: 'Comprehensive system administration and management.',
    icon: Shield,
    path: '/admin',
    requiredRole: ['admin'],
    features: [
      'User Management',
      'System Settings',
      'Analytics Dashboard',
      'Security Controls'
    ],
    notifications: true,
    messaging: true,
    documents: true
  },
  professional 
  : {
    id: 'professional',
    title: 'Professional Portal',
    description: 'Access professional tools and client management.',
    icon: Shield,
    path: '/professional',
    requiredRole: ['professional'],
    features: [
      'Client Management',
      'Analytics Tools',
      'Reporting Tools',
      'Consultation Scheduling'
    ],
    notifications: true,
    messaging: true,
    documents: true
  },
  student: {
    id: 'student',
    title: 'Student Portal',
    description: 'Access educational resources and financial learning materials.',
    icon: BookOpen,
    path: '/student',
    requiredRole: ['student'],
    features: [
      'Financial Education',
      'Learning Resources',
      'Practice Exercises',
      'Progress Tracking'
    ],
    notifications: true,
    messaging: true,
    documents: true
  },
  investor: {
    id: 'investor',
    title: 'Investor Portal',
    description: 'Access investment tools and market insights.',
    icon: TrendingUp,
    path: '/investor',
    requiredRole: ['investor'],
    features: [
      'Portfolio Management',
      'Market Analysis',
      'Investment Tools',
      'Performance Tracking'
    ],
    notifications: true,
    messaging: true,
    documents: true
  },
  client: {
    id: 'client',
    title: 'Client Portal',
    description: 'Access your dashboard, consultations, and documents.',
    icon: User,
    path: '/client',
    requiredRole: ['client'],
    features: [
      'Dashboard',
      'Consultations',
      'Documents',
      'Notifications'
    ],
    subFeatures: [
      'Consultation Booking',
      'Consultation History',
      'Document Uploads',
      'Document Storage',
      'Appointments'
      ],
    subFeatureDescriptions: [
      'Book and manage consultations with professionals.',
      'View and manage your consultation history.',
      'Upload and manage your documents securely.',
      'Store and access your documents securely.',
      'View and manage your past appointments.'
    ],
    notifications: true,
    messaging: true,
    documents: true
  },
  consultation: {
    id: 'consultation',
    title: 'Consultations',
    description: 'Schedule and manage your consultations.',
    icon: BookOpen,
    path: '/consultation',
    requiredRole: ['client'],
    features: [
      'Book Consultation',
      'Consultation History'
    ],
    notifications: true,
    messaging: true,
    documents: false
  },
  messages: {
    id: 'messages',
    title: 'Secure Messaging',
    description: 'End-to-end communication platform.',
    icon: ShieldCheck,
    path: '/messages',
    allowedRoles: [
      'Client',
      'Professional',
      'Investor',
      'Student',
      'Admin',
      'Superadmin'
    ],
    features: [
      'End-to-End Encryption',
      'File Sharing',
      'Message History',
      'Real-time Chat'
    ],
    notifications: true
  }
};

export function getPortalConfig(portalId: string): PortalConfig | undefined {
  return PORTAL_CONFIGS[portalId];
}

export function getAvailablePortals(userRole?: string): PortalConfig[] {
  return Object.values(PORTAL_CONFIGS).filter(config => 
    !config.requiredRole || (userRole && config.requiredRole.includes(userRole))
  );
}