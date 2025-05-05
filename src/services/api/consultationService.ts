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
// Removed redundant create function
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
    try {
      // Simulated availability
      return Promise.resolve([
        { time: '10:00 AM', available: true },
        { time: '11:00 AM', available: false },
      ]);
    } catch (error) {
      console.error('Error fetching availability:', error);
      throw error;
    }
  },

  getById: async (id: string) => {
    try {
      const response = await api.get<Consultation>(`/consultations/${id}`);
      return response;
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