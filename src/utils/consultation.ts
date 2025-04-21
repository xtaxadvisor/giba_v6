import { api } from '../services/api';
import type { Consultation } from '../types/index'; // Adjusted the path to match the correct location

export const consultationService = {
  async getConsultations() {
    return await api.get<Consultation[]>('/consultations');
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
    const response = await api.get<Consultation>(`/consultations/${id}`);
    return response.data;
  },

  create: (data: Partial<Consultation>) => 
    api.post<Consultation>('/consultations', data),

  update: (id: string, data: Partial<Consultation>) =>
    api.put<Consultation>(`/consultations/${id}`, data),

  delete: (id: string) =>
    api.delete<void>(`/consultations/${id}`),

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