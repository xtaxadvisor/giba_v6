import { supabase } from '../../lib/supabase';
import { awsEmailService } from '../email/awsEmail';
import { authorizeNetService } from '../payment/authorizeNet';
import { useNotificationStore } from '../../lib/store';
import type { TimeSlot } from '../../types';

export class BookingService {
  private static instance: BookingService;

  private constructor() {}

  public static getInstance(): BookingService {
    if (!BookingService.instance) {
      BookingService.instance = new BookingService();
    }
    return BookingService.instance;
  }

  async getAvailability(date: string, professionalId: string): Promise<TimeSlot[]> {
    try {
      const startOfDay = `${date}T00:00:00.000Z`;
      const endOfDay = `${date}T23:59:59.999Z`;

      const { data: existingBookings, error } = await supabase
        .from('consultations')
        .select('start_time, end_time')
        .eq('professional_id', professionalId)
        .gte('start_time', startOfDay)
        .lte('start_time', endOfDay);

      if (error) throw error;

      // Generate time slots
      const slots: TimeSlot[] = [];
      const startHour = 9; // 9 AM
      const endHour = 17; // 5 PM
      const slotDuration = 30; // 30 minutes

      for (let hour = startHour; hour < endHour; hour++) {
        for (let minute = 0; minute < 60; minute += slotDuration) {
          const time = new Date(`${date}T${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
          const endTime = new Date(time);
          endTime.setMinutes(endTime.getMinutes() + slotDuration);

          const isBooked = existingBookings?.some(booking => {
            const bookingStart = new Date(booking.start_time);
            const bookingEnd = new Date(booking.end_time);
            return time < bookingEnd && endTime > bookingStart;
          });

          if (!isBooked) {
            slots.push({
              startTime: time.toISOString(),
              endTime: endTime.toISOString(),
              available: true,
            });
          }
        }
      }

      return slots;
    } catch (error) {
      console.error('Error fetching availability:', error);
      throw error;
    }
  }

  async createBooking(bookingData: {
    service: string;
    date: string;
    time: string;
    professionalId: string;
    clientId: string;
    paymentDetails: {
      cardNumber: string;
      expirationDate: string;
      cardCode: string;
      amount: number;
    };
  }) {
    try {
      const paymentResult = await authorizeNetService.processPayment({
        amount: bookingData.paymentDetails.amount,
        cardNumber: bookingData.paymentDetails.cardNumber,
        expirationDate: bookingData.paymentDetails.expirationDate,
        cardCode: bookingData.paymentDetails.cardCode,
      });

      if (!paymentResult.success) {
        throw new Error('Payment failed');
      }

      const startTime = new Date(`${bookingData.date}T${bookingData.time}`);
      const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

      const { data: booking, error: bookingError } = await supabase
        .from('consultations')
        .insert({
          client_id: bookingData.clientId,
          professional_id: bookingData.professionalId,
          type: bookingData.service,
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          status: 'scheduled',
          payment_id: paymentResult.transactionId,
        })
        .select()
        .maybeSingle();

      if (bookingError) throw bookingError;

      const { data: client } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', bookingData.clientId)
        .maybeSingle();

      if (client?.email) {
        await awsEmailService.sendBookingConfirmation(client.email, {
          service: bookingData.service,
          date: bookingData.date,
          time: bookingData.time,
          professional: 'Your Tax Professional',
          price: bookingData.paymentDetails.amount,
        });
      }

      useNotificationStore.getState().addNotification(
        'Booking confirmed! Check your email for details.',
        'success'
      );

      return booking;
    } catch (error) {
      console.error('Booking error:', error);
      useNotificationStore.getState().addNotification(
        'Booking failed. Please try again.',
        'error'
      );
      throw error;
    }
  }
}

export const bookingService = BookingService.getInstance();