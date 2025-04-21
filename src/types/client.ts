export interface HealthMetric {
  name: string;
  score: number;
  trend?: 'up' | 'down' | 'stable';
}

export interface FinancialHealth {
  score: number;
  metrics: HealthMetric[];
  lastUpdated: string;
}
// Define and export the Investor type
export interface Investor {
  settings: any;
  id: string;
  name: string;
  email: string;
  // Add other fields as necessary
}
export interface Client {
  firstName: string;
  lastName: string;
  id: string | number;
  avatarUrl?: string;
  role: 'client' | 'student' | 'investor' | 'professional' | 'admin' | 'superadmin';
  email: string;
  phone: string;
  company?: string;
  address?: string; // Added address property
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