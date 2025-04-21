export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  role: UserRole;
  createdAt: string;
  location?: string;
  bio?: string;
}

export interface Client {
  email: string;
  phone: string;
  company?: string;
  address?: string;
  website?: string;
  createdAt: string;
  status: 'active' | 'inactive';
  notes?: string;
  recentActivity?: {
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    description: string;
    timestamp: string;
  }[];
}

export type UserRole = 'user' | 'moderator' | 'admin';

export interface UserProfile extends User {
  threadCount: number;
  replyCount: number;
  joinedAt: string;
  lastActive: string;
}