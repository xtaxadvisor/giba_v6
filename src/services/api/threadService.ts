import type { Thread } from '../../types/messaging'; // Adjust path as needed
import axios from 'axios';

const customApi = axios.create({
  baseURL: import.meta.env.VITE_SUPABASE_REST_URL,
  headers: {
    apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json'
  }
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
   * Get a thread by ID
   * @param id - Thread ID
   */
  getById: async (id: string): Promise<Thread> => {
    const response = await customApi.get<Thread[]>(`/threads?id=eq.${id}`);
    if (!response.data.length) {
      throw new Error('Thread not found');
    }
    return response.data[0];
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
  },
  update: async (id: string, data: Partial<Thread>): Promise<Thread> => {
    const response = await customApi.patch<Thread>(`/threads/${id}`, data);
    return response.data;
  }
};