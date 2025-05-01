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
  id: string;
  title: string;
  content: string;
  createdAt: string;
  likes: number; // Added likes property
  replies?: Reply[];
}

export interface Thread {
    author: any;
    id: string;
    title: string;
    participants: string[];
    recipientId: string; // ID of the message recipient
    lastMessage: string;
    createdAt: string;
    updatedAt: string;
    description: string; // Optional field for thread description
    isPinned: boolean; // Optional field to indicate if the thread is pinned
    replyCount: number; // Optional field for the number of replies
    // Ensure the Reply type is defined or imported
    tags: string[]; // Optional field for tags associated with the thread
    isArchived: boolean; // Optional field to indicate if the thread is archived
    isFavorite: boolean; // Optional field to indicate if the thread is marked as favorite
    isMuted: boolean; // Optional field to indicate if the thread is muted
    isReported: boolean; // Optional field to indicate if the thread is reported
    isFollowed: boolean; // Optional field to indicate if the thread is followed
    isBlocked: boolean; // Optional field to indicate if the thread is blocked
    isStarred: boolean; // Optional field to indicate if the thread is starred
    isSubscribed: boolean; // Optional field to indicate if the thread is subscribed
    replies?: Reply[]; // Optional field for replies
      isDeleted: boolean; // Optional field to indicate if the thread is deleted
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
    recipientId: string; // ID of the message recipient
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
    // Missing recipientId
}