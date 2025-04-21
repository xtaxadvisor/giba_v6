import type { Thread } from '../../types/messaging'; // Adjust path as needed
import axios from 'axios';

export const customApi = axios.create({
  baseURL: 'https://your-api-base-url.com', // Replace with your API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});
export const threadService = {
  /**
   * Get all message threads
   */
  getAll: async (): Promise<Thread[]> => {
    const response = await customApi.get<Thread[]>('/threads');
    return response.data;
  },

  /**
   * Create a new thread
   * @param data - Thread creation payload
   */
  create: async (data: Partial<Thread>): Promise<Thread> => {
    const response = await customApi.post<Thread>('/threads', data);
    return response.data;
  },

  /**
   * Delete a thread by ID
   * @param id - Thread ID
   */
  delete: async (id: string): Promise<void> => {
    await customApi.delete(`/threads/${id}`);
  }
};