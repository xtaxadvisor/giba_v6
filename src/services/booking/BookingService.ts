import { supabase } from '../../lib/supabase'; // Updated import
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

      const slots: TimeSlot[] = [];
      const startHour = 9;
      const endHour = 17;
      const slotDuration = 30;

      for (let hour = startHour; hour < endHour; hour++) {
        for (let minute = 0; minute < 60; minute += slotDuration) {
          const slotStart = new Date(`${date}T${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00.000Z`);
          const slotEnd = new Date(slotStart.getTime() + slotDuration * 60000);

          const isBooked = existingBookings?.some(booking => {
            const bookingStart = new Date(booking.start_time);
            const bookingEnd = new Date(booking.end_time);
            return slotStart < bookingEnd && slotEnd > bookingStart;
          });

          if (!isBooked) {
            slots.push({
              startTime: slotStart.toISOString(),
              endTime: slotEnd.toISOString(),
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
      // Process payment first
      const paymentResult = await authorizeNetService.processPayment({
        amount: bookingData.paymentDetails.amount,
        cardNumber: bookingData.paymentDetails.cardNumber,
        expirationDate: bookingData.paymentDetails.expirationDate,
        cardCode: bookingData.paymentDetails.cardCode
      });

      if (!paymentResult.success) {
        throw new Error('Payment failed');
      }

      // Create booking record
      const { data: booking, error: bookingError } = await supabase
        .from('consultations')
        .insert({
          client_id: bookingData.clientId,
          professional_id: bookingData.professionalId,
          type: bookingData.service,
          start_time: `${bookingData.date}T${bookingData.time}`,
          end_time: new Date(
            new Date(`${bookingData.date}T${bookingData.time}`).getTime() + 60 * 60 * 1000
          ).toISOString(),
          status: 'scheduled',
          payment_id: paymentResult.transactionId
        })
        .select()
       .maybeSingle();

      if (bookingError) throw bookingError;

      // Get client email
      const { data: client } = await supabase
        .from('profiles')  
        .select('email')
        .eq('id', bookingData.clientId)
        .maybeSingle();

      // Send confirmation email
      if (client?.email) {
        await awsEmailService.sendBookingConfirmation(client.email, {
          service: bookingData.service,
          date: bookingData.date,
          time: bookingData.time,
          professional: 'Your Tax Professional', // Get actual name from professional record
          price: bookingData.paymentDetails.amount
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