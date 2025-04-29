import { api } from '../../services/api';
// Define the Appointment type locally if it is not exported from the module
type Appointment = {
  id: string;
  date: string;
  time: string;
  serviceType: string;
  [key: string]: any; // Add additional fields as needed
};
// If 'Appointment' is not exported, verify the correct export name or define the type locally.

export const appointmentService = {
  async getAppointment() {
    const response = await api.get<Appointment[]>('/appointments');
    return response;
  },

  async getAvailability() {
    return Promise.resolve([
      { time: '10:00 AM', available: true },
      { time: '11:00 AM', available: false },
    ]);
  },

  getAll: () => api.get<Appointment[]>('/appointments'),

  getById: async (id: string) => {
    const response = await api.get<Appointment>(`/appointments/${id}`);
    return response.data;
  },

  create: (data: Partial<Appointment>) =>
    api.post<Appointment>('/appointments', data),

  update: (id: string, data: Partial<Appointment>) =>
    api.put<Appointment>(`/appointments/${id}`, data),

  delete: (id: string) =>
    api.delete<void>(`/appointments/${id}`),

  initiateAppointment: async (serviceType: string) => {
    try {
      const response = await api.post<{ redirectUrl: string }>('/appointments/initiate', {
        serviceType
      });
      return response.redirectUrl;
    } catch (error) {
      console.error('Failed to initiate appointment:', error);
      throw error;
    }
  }
};