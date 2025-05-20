import type { User } from './user';

export interface Thread {
  id: string;
  title: string;
  comments: any[];
  content: string;
  category: ThreadCategory; // TODO: change to enum   
  createdAt: string;
  updatedAt?: string; 
  replies: number;
  likes: number;
  tags: string[];
  ispinned: boolean;
  author: {
    avatarUrl: string;
    displayName: string;
    location?: string; // Optional location property
  };
}





export interface TreadForm {
  title: string;
  content: string;
  tags?: string[];
  category: ThreadCategory;
}

export interface Reply {
  id: string;
  threadId: string;
  content: string;
  authorId: string;
  author: User;
  createdAt: string;
  updatedAt: string;
  likes: number;
  parentId?: string;
}

export type ThreadCategory = 
  | 'buying'
  | 'selling'
  | 'hoa'
  | 'maintenance'
  | 'insurance'
  | 'contractors'
  | 'tenants'
  | 'legal'
  | 'market-trends'
  | 'general';

export interface ThreadFilters {
  category?: ThreadCategory;
  location?: string;
  tags?: string[];
  sortBy?: 'recent' | 'popular' | 'unanswered';
  timeframe?: 'day' | 'week' | 'month' | 'year' | 'all';
}