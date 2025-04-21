
import type { appointmentService } from '../lib/auth/types';
import { api } from '@/services/api'; // eslint-disable-line no-unused-vars   // Adjusted the path to match the correct location of the file in the project structure   // Adjusted the path to match the correct location of the file in the project structure  // Adjusted the path to match the correct location of the file in the project structure   // Adjusted the path to match the correct location of the file in the project structure


export const appointmentServiceAPI = {
  async getAppointmentService() {
    const response = await api.get<appointmentService[]>('/appointments');
    return response;
  },

  async getAvailability() {
    return Promise.resolve([
      { time: '10:00 AM', available: true },
      { time: '11:00 AM', available: false },
    ]);
  },

  getAll: () => api.get<appointmentService[]>('/appointments'),

  getById: async (id: string) => {
    const response = await api.get<appointmentService>(`/appointments/${id}`);
    return response;
  },

  create: (data: Partial<appointmentService>) =>
    api.post<appointmentService>('/appointments', data),

  update: (id: string, data: Partial<appointmentService>) =>
    api.put<appointmentService>(`/appointments/${id}`, data),

  delete: (id: string) => api.delete<void>(`/appointments/${id}`),

  initiateAppointment: async (serviceType: string) => {
    try {
      const response = await api.post<{ redirectUrl: string }>(
        '/appointments/initiate',
        { serviceType }
      );
      return response.redirectUrl;
    } catch (error) {
      console.error('Failed to initiate appointment:', error);
      throw error;
    }
  }
};