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
  getThreads: async () => {
    try {
      console.log('[messageService.getThreads]');
      const result = await api.get<MessageThread[]>('/messages/threads');
      console.log('[messageService.getThreads] Success:', result);
      return result;
    } catch (error) {
      console.error('[messageService.getThreads] Error:', error);
      throw error;
    }
  },

  /** Fetches full message history for a thread */
  getThread: async (threadId: string) => {
    try {
      console.log('[messageService.getThread]', threadId);
      const result = await api.get<Message[]>(`/messages/threads/${threadId}`);
      console.log('[messageService.getThread] Success:', result);
      return result;
    } catch (error) {
      console.error('[messageService.getThread] Error:', error);
      throw error;
    }
  },

  /** Sends a message to another user, starting or continuing a thread */
  send: async (data: SendMessageDTO) => {
    try {
      console.log('[messageService.send]', data);
      const result = await api.post<Message>('messages', data);
      console.log('[messageService.send] Success:', result);
      return result;
    } catch (error) {
      console.error('[messageService.send] Error:', error);
      throw error;
    }
  },

  /** Marks a message as read by the current user */
  markAsRead: async (messageId: string) => {
    try {
      console.log('[messageService.markAsRead]', messageId);
      const result = await api.put<void>(`/messages/${messageId}/read`);
      console.log('[messageService.markAsRead] Success:', result);
      return result;
    } catch (error) {
      console.error('[messageService.markAsRead] Error:', error);
      throw error;
    }
  },

  /** Permanently deletes a message */
  delete: async (messageId: string) => {
    try {
      console.log('[messageService.delete]', messageId);
      const result = await api.delete<void>(`/messages/${messageId}`);
      console.log('[messageService.delete] Success:', result);
      return result;
    } catch (error) {
      console.error('[messageService.delete] Error:', error);
      throw error;
    }
  },
};