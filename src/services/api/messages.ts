import { api } from '../api';
import { Message } from '../../types';

/**
 * Data Transfer Object for sending a message.
 */
export interface SendMessageDTO {
  /** ID of the message recipient */
  recipientId: string;
  /** Content of the message */
  content: string;
  /** Optional array of attachment URLs or identifiers */
  attachments?: string[];
  /** Optional ID of the thread to which this message belongs */
  threadId?: string;
  /** ID of the message sender */
  senderId: string;
}

export interface MessageThread {
  id: string;
  participants: string[];
  lastMessage: Message;
  unreadCount: number;
  [x: string]: string | string[] | Message | number;
}

export const messageService = {
  /** Fetches all threads involving the user */
  getThreads: () =>
    api.get<MessageThread[]>('/messages/threads'),

  /** Fetches full message history for a thread */
  getThread: (threadId: string) =>
    api.get<Message[]>(`/messages/threads/${threadId}`),

  /** Sends a message to another user, starting or continuing a thread */
  send: (data: SendMessageDTO) =>
    api.post<Message>('messages', data),

  /** Marks a message as read by the current user */
  markAsRead: (messageId: string) =>
    api.put<void>(`/messages/${messageId}/read`),

  /** Permanently deletes a message */
  delete: (messageId: string) =>
    api.delete<void>(`/messages/${messageId}`),
};