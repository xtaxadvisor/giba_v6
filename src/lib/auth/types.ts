export interface AuthCredentials {
  email: string;
  password: string;
}
// Existing exports in the file
export type Message = {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  attachments?: Attachment[];
};

// Define and export the Attachment type
export type Attachment = {
  name: string;
  url: string; // Add other fields as needed
};
export interface Thread {
  id: string;
  title?: string;
  content: string; // Added the missing 'content' property
  likes: number;
  createdAt: string;
  replies?: Reply[];
}
export interface UpdateEventDTO {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  location?: string;
}
export type ChatMessage = {
  senderId: string;
  timestamp: string | Date;
  content: string;
  attachments?: Attachment[];
};

export interface RegisterData extends AuthCredentials {
  name: string;
  role: string;
}
// Add the definition and export for UpdateEventDTO if missing
export interface UpdateEventDTO {
  id: string;
  title: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  type?: 'meeting' | 'deadline' | 'reminder';
  location?: string;
  isVirtual?: boolean;
  meetingLink?: string;
  attendees?: Array<{
    id: string;
    name: string;
    email: string;
    status: 'pending' | 'accepted' | 'declined';
  }>;
  reminders?: Array<{
    type: 'email' | 'notification';
    time: number; // minutes before event
  }>;
}
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  createdAt: string;
  location: string;
  displayName: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface MenuItem {
  title: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export interface NotificationMessage {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: string;
}

// In ../../types
export default interface Reply {
    id: string;
    content: string;
    author: string;
    createdAt: string;
}

// filepath: ../../types/index.ts
export interface LocalThread {
    id: string;
    title: string;
    content: string;
    author: string;
    createdAt: string;
    replies: number; // Example field for the number of replies
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  assignedTo?: string;
  clientId?: string;
  status: 'pending' | 'in-progress' | 'completed';
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

export interface appointmentService {    
  id: string;
  date: string;
  time: string;
  serviceType: string;
  customerName: string;
}

export interface consultationtype {
  id: string;
  date: string;  
  serviceType: string;
  customerName: string;
}

export interface appointment { 
  id: string;
  date: string;
  time: string;
  serviceType: string;
  customerName: string;
  consultationtype: consultationtype[];
}

export interface Consultation {
  status: string;
  type: string;
  startTime: string;
  professionalId: string;
  clientId: string;
  id: string;
  date: string;
  time: string;
  serviceType: string;
  customerName: string; 
}

export type UserRole = 'client' | 'student' | 'investor' | 'professional' | 'admin' | 'editor' | 'viewer' | 'superadmin';