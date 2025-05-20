// src/types/messaging.ts

// Define or import the Reply type
export interface Reply {
  id: string;
  content: string;
  createdAt: string;
  author: {
    displayName: string;
    avatarUrl?: string; // Add other properties if needed
  };
}

export interface Thread {
  category: string;
  comments: never[];
  id: string;
  title: string;
  content: string;
  description: string;
  author: any;
  participants: string[];
  recipientId: string;
  lastMessage: string;
  createdAt: string;
  updatedAt: string;
  likes: number;
  replyCount: number;
  tags: string[];
  isPinned: boolean;
  isArchived: boolean;
  isFavorite: boolean;
  isMuted: boolean;
  isReported: boolean;
  isFollowed: boolean;
  isBlocked: boolean;
  isStarred: boolean;
  isSubscribed: boolean;
  isDeleted: boolean;
  replies?: Reply[];
}

export type DetailedReply = {
  id: string;
  content: string;
  createdAt: string | Date;
  likes: number;
  author: {
    displayName: string;
    avatarUrl?: string;
  };
};

export interface MessageThread {
  id: string;
  title: string;
  lastMessage: string; // Last message content
  createdAt: string; // Timestamp of thread creation
  updatedAt: string; // Timestamp of last update
  participants: string[]; // List of participant IDs
  recipientId: string; // ID of the user receiving the thread
  isPinned: boolean; // Indicates if the thread is pinned
  isArchived: boolean; // Indicates if the thread is archived
  isFavorite: boolean; // Indicates if the thread is marked as favorite
  isMuted: boolean; // Indicates if the thread is muted
  isReported: boolean; // Indicates if the thread is reported
  isFollowed: boolean; // Indicates if the thread is followed
  isBlocked: boolean; // Indicates if the thread is blocked
  isStarred: boolean; // Indicates if the thread is starred
  isSubscribed: boolean; // Indicates if the thread is subscribed
  isDeleted: boolean; // Indicates if the thread is deleted
  isDraft: boolean; // Indicates if the thread is a draft
  isSent: boolean; // Indicates if the thread is sent
  isReceived: boolean; // Indicates if the thread is received
  isRead: boolean; // Indicates if the thread is read
  isDelivered: boolean; // Indicates if the thread is delivered
  isSeen: boolean; // Indicates if the thread is seen
  isReplied: boolean; // Indicates if the thread is replied
  isForwarded: boolean; // Indicates if the thread is forwarded
  isShared: boolean; // Indicates if the thread is shared
  isSaved: boolean; // Indicates if the thread is saved
}