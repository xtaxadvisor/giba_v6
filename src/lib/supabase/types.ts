export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]
export interface MenuItem {
    title: string;
    href: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
} // Added missing closing brace
export interface consultation { 
  id: number;
  client_id: string;
  professional_id: string;
  type: string;
  status: string;
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string;
  }
  export interface consultationList { 
    consultations: consultation[];
    }
// Added missing closing brace
export interface ForumThread {
  id: string;
  title: string;
  createdAt: Date;
  replyCount: number;
  likes: number;
  tags: string[];
  isPinned: boolean;
  description?: string; // Added description property
  author: {
    avatarUrl: string;
    displayName: string;
    location?: string;
  };
}
export interface UpdateEventDTO {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  location?: string;
}
  // Existing exports in the types file
export type Thread = {
  id: string;
  title: string;
  content: string;
  likes: number;
  createdAt: string;
};
// Add the Attachment type definition and export it
export type Attachment = {
  name: string;
  url: string; // Add other fields as necessary
};

// Removed duplicate Message type definition to resolve the error.

// Add the missing Reply type
export type Reply = {
  id: string;
  content: string;
  likes: number;
  createdAt: string;
  author: {
    displayName: string;
    avatarUrl?: string;
  };
};
  
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          auth_id: string | null
          name: string
          email: string
          role: string
          phone: string | null
          company: string | null
          location: string | null
          bio: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          auth_id?: string | null
          name: string
          email: string
          role: string
          phone?: string | null
          company?: string | null
          location?: string | null
          bio?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          auth_id?: string | null
          name?: string
          email?: string
          role?: string
          phone?: string | null
          company?: string | null
          location?: string | null
          bio?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      clients: {
        Row: {
          id: string
          user_id: string
          status: string
          tax_id: string | null
          industry: string | null
          annual_revenue: number | null
          client_since: string
          last_contact: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          status?: string
          tax_id?: string | null
          industry?: string | null
          annual_revenue?: number | null
          client_since?: string
          last_contact?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          status?: string
          tax_id?: string | null
          industry?: string | null
          annual_revenue?: number | null
          client_since?: string
          last_contact?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      professionals: {
        Row: {
          id: string
          user_id: string
          title: string
          specializations: string[] | null
          certifications: string[] | null
          availability: Json | null
          hourly_rate: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          specializations?: string[] | null
          certifications?: string[] | null
          availability?: Json | null
          hourly_rate?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          specializations?: string[] | null
          certifications?: string[] | null
          availability?: Json | null
          hourly_rate?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      consultations: {
        Row: {
          id: string
          client_id: string
          professional_id: string
          type: string
          status: string
          start_time: string
          end_time: string
          is_virtual: boolean
          meeting_link: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          professional_id: string
          type: string
          status?: string
          start_time: string
          end_time: string
          is_virtual?: boolean
          meeting_link?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          professional_id?: string
          type?: string
          status?: string
          start_time?: string
          end_time?: string
          is_virtual?: boolean
          meeting_link?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          owner_id: string
          title: string
          description: string | null
          file_path: string
          file_type: string
          file_size: number
          status: string
          tags: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          title: string
          description?: string | null
          file_path: string
          file_type: string
          file_size: number
          status?: string
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          title?: string
          description?: string | null
          file_path?: string
          file_type?: string
          file_size?: number
          status?: string
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          sender_id: string
          recipient_id: string
          content: string
          is_read: boolean
          attachments: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          sender_id: string
          recipient_id: string
          content: string
          is_read?: boolean
          attachments?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          sender_id?: string
          recipient_id?: string
          content?: string
          is_read?: boolean
          attachments?: string[] | null
          created_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          title: string
          description: string | null
          creator_id: string
          assignee_id: string | null
          client_id: string | null
          status: string
          priority: string
          due_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          creator_id: string
          assignee_id?: string | null
          client_id?: string | null
          status?: string
          priority?: string
          due_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          creator_id?: string
          assignee_id?: string | null
          client_id?: string | null
          status?: string
          priority?: string
          due_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      analytics: {
        Row: {
          id: string
          user_id: string
          event_type: string
          event_data: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          event_type: string
          event_data: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          event_type?: string
          event_data?: Json
          created_at?: string
        }
      }
    }
  }
}
export interface MenuItem {
  id: string;
  title: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  href: string;
}
export interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: string;
}

// Exporting the Appointment type
// Define and export the Client type
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