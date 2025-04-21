import { api } from '../api';
// Removed unused imports from 'date-fns'
import type { TimeSlot } from '../../types';
import { UpdateEventDTO } from '@/lib/supabase/types';

export interface Event {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  type: 'meeting' | 'deadline' | 'reminder';
  location?: string;
  isVirtual?: boolean;
  meetingLink?: string;
  attendees?: Array<{
    id: string;
    name: string;
    email: string;
    status: 'pending' | 'accepted' | 'declined';
  }>;
  reminders?: Array<{
    type: 'email' | 'notification';
    time: number; // minutes before event
  }>;
}

export const calendarService = {
  getEvents: () => 
    api.get<Event[]>('/calendar/events'),

  getEventById: (id: string) => 
    api.get<Event>(`/calendar/events/${id}`),

  createEvent: (data: any) => 
    api.post<Event>('/calendar/events', data),

  updateEvent: ({ id, ...data }: UpdateEventDTO) => 
    api.put<Event>(`/calendar/events/${id}`, data),

  deleteEvent: (id: string) => 
    api.delete<void>(`/calendar/events/${id}`),

  getAvailability: async (date: string, professionalId: string) => {
    const queryParams = new URLSearchParams({ date, professionalId }).toString();
    const response = await api.get<TimeSlot[]>(`/calendar/availability?${queryParams}`);

    return response.map(slot => ({
      ...slot,
      startTime: new Date(slot.startTime).toISOString(),
      endTime: new Date(slot.endTime).toISOString()
    }));
  },

  syncCalendar: (provider: string) => 
    api.post<void>('/calendar/sync', { provider }),

  sendBookingConfirmation: async (eventId: string) => {
    return api.post<void>(`/calendar/events/${eventId}/confirm`);
  },

  checkAvailability: async (startTime: string, endTime: string, professionalId: string) => {
    const queryParams = new URLSearchParams({ startTime, endTime, professionalId }).toString();
    return api.get<{ available: boolean }>(`/calendar/check-availability?${queryParams}`);
  }
};