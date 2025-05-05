import { api } from '../services/api';
import type { Consultation } from '../types/index'; // Adjusted the path to match the correct location

export const consultationService = {
  async getConsultations() {
    try {
      return await api.get<Consultation[]>('/consultations');
    } catch (error) {
      console.error('Error fetching consultations:', error);
      throw error;
    }
  },

  async getAvailability() {
    // Mock implementation for fetching availability
    return Promise.resolve([
      { time: '10:00 AM', available: true },
      { time: '11:00 AM', available: false },
    ]);
  },

  getAll: () => api.get<Consultation[]>('/consultations'),

  getById: async (id: string) => {
    try {
      const response = await api.get<Consultation>(`/consultations/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching consultation with ID ${id}:`, error);
      throw error;
    }
  },

  create: async (data: Partial<Consultation>) => {
    try {
      return await api.post<Consultation>('/consultations', data);
    } catch (error) {
      console.error('Error creating consultation:', error);
      throw error;
    }
  },

  update: async (id: string, data: Partial<Consultation>) => {
    try {
      return await api.put<Consultation>(`/consultations/${id}`, data);
    } catch (error) {
      console.error(`Error updating consultation with ID ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string) => {
    try {
      return await api.delete<void>(`/consultations/${id}`);
    } catch (error) {
      console.error(`Error deleting consultation with ID ${id}:`, error);
      throw error;
    }
  },

  initiateConsultation: async (serviceType: string) => {
    try {
      const response = await api.post<{
        data: any; redirectUrl: string 
}>('/consultations/initiate', {
        serviceType
      });
      return response.data.redirectUrl;
    } catch (error) {
      console.error('Failed to initiate consultation:', error);
      throw error;
    }
  }
};