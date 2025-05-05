import { ReactNode } from "react";

// TimeSlot type
export interface TimeSlot {
  startTime: string;
  endTime: string;
  available: boolean;
}

// EventDTO type
export interface EventDTO {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  type: 'meeting' | 'deadline' | 'reminder';
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
  status?: 'pending' | 'confirmed' | 'cancelled';
  clientId?: string;
  professionalId?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  notes?: string;
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
    createdAt: string;
    updatedAt: string;
    status: 'pending' | 'uploaded' | 'failed';
    error?: string;
    progress?: number;
  }>;
}

// Reply type
export interface Reply {
  id: string;
  content: string;
  createdAt: string;
  author: {
    displayName: string;
    avatarUrl?: string;
  };
}

// Consultation type
export interface Consultation {
  [x: string]: any;
  id: string;
  startTime: string | number | Date;
  endTime: string;
  date: string;
  professionalId: string;
  clientId: string;
  serviceType: string;
  status: string;
  type: ReactNode;
  data: any;
}

// User type
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string | Date;
  location: string;
  avatarUrl?: string;
  displayName?: string;
}

// Task type
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

// Thread type
export interface Thread {
  id: string;
  title: string;
  content: string;
  author: {
    displayName: string;
    avatarUrl?: string;
    location?: string;
  };
  website?: string;
  createdAt: string;
  status: 'active' | 'inactive';
  notes?: string;
  recentActivity?: Array<{
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    description: string;
    timestamp: string;
  }>;
}

// MenuItem type
export interface MenuItem {
  title: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

// Document type
export interface Document {
  id: string;
  title: string;
  clientId: string;
  type: string;
  content: string;
  tags?: string[];
  uploadedAt: string;
  updatedAt: string;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  createdBy: string;
  updatedBy: string;
  description?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  fileExtension?: string;
  filePreviewUrl?: string;
  fileThumbnailUrl?: string;
  fileIcon?: string;
  fileStatus?: 'uploading' | 'uploaded' | 'failed';
  fileProgress?: number;
  fileError?: string;
  fileId?: string;
  fileKey?: string;
  fileBucket?: string;
  fileRegion?: string;
  fileS3Url?: string;
}

// Message type
export interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: string;
  attachments?: Attachment[];
}

// Attachment type
export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  status: 'pending' | 'uploaded' | 'failed';
  progress?: number;
  error?: string;
  fileId?: string;
  fileKey?: string;
  fileBucket?: string;
  fileRegion?: string;
  fileS3Url?: string;
}

// Export all types 