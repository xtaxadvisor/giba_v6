// src/services/api/consultationService.ts
import { api } from '../api';
import type { Consultation as ExternalConsultation } from '../../types'; // Ensure this matches the expected type

// Export the updateInvestorSettings function
export async function updateInvestorSettings(
  investorId: string,
  settings: { emailNotifications: boolean; smsNotifications: boolean; timezone: string }
): Promise<void> {
  // Implementation of the function
  // Example: Make an API call to update the settings
  await fetch(`/api/investors/${investorId}/settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(settings),
  });
}
export type LocalConsultation = {
  id: string; // or number, depending on your API
  type: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  startTime: string;
  endTime: string;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  clientAddress?: string;
  clientNotes?: string;
  isVirtual?: boolean;
  location?: string; // Added location property
  meetingLink?: string;
  // Add any other properties you need
  // other properties
};
export type Consultation = {
  id: number | string;
  type: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  startTime: string;
  endTime: string;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  clientAddress?: string;
  clientNotes?: string;
  isVirtual?: boolean;
  location?: string; // Added location property
  meetingLink?: string;
  // Add any other properties you need
  // other properties
};
export async function create(data: any): Promise<ExternalConsultation> {
  const response = await api.post<{ data: ExternalConsultation }>('/consultations', data);
  return response.data;
}
export const consultationService = {
  async getConsultations() {
    return await api.get<Consultation[]>('/consultations');
  },

  async getAvailability() {
    return Promise.resolve([
      { time: '10:00 AM', available: true },
      { time: '11:00 AM', available: false },
    ]);
  },

  getAll: () => api.get<Consultation[]>('/consultations'),

  getById: async (id: string) => {
    const response = await api.get<Consultation>(`/consultations/${id}`);
    return response;
  },

  create: (data: Partial<Consultation>) =>
    api.post<Consultation>('/consultations', data),

  update: (id: string, data: Partial<Consultation>) =>
    api.put<Consultation>(`/consultations/${id}`, data),

  delete: (id: string) => api.delete<void>(`/consultations/${id}`),

  initiateConsultation: async (serviceType: string) => {
    try {
      const response = await api.post<{ redirectUrl: string }>(
        '/consultations/initiate',
        { serviceType }
      );
      return response.redirectUrl;
    } catch (error) {
      console.error('Failed to initiate consultation:', error);
      throw error;
    }
  }
};