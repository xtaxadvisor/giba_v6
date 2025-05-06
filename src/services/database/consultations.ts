import { DatabaseService } from './index';
import type { Database } from '../../lib/supabase/types';
import { supabase } from '../../lib/supabase/client';

type Consultation = Database['public']['Tables']['consultations']['Row'];

class ConsultationService extends DatabaseService<'consultations'> {
  constructor() {
    super('consultations');
  }

  async getUpcoming(userId: string) {
    console.time('[ConsultationService.getUpcoming]');
    console.log('[ConsultationService.getUpcoming] Fetching upcoming consultations for:', userId);
    try {
      const { data, error } = await supabase
        .from(this.table)
        .select(`
          *,
          clients (
            id,
            user_id,
            status
          ),
          professionals (
            id,
            user_id,
            title
          )
        `)
        .or(`clients.user_id.eq.${userId},professionals.user_id.eq.${userId}`)
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true });

      if (error) {
        console.error('[ConsultationService.getUpcoming] Error:', error);
        throw error;
      }
      console.log('[ConsultationService.getUpcoming] Result:', data);
      return data;
    } finally {
      console.timeEnd('[ConsultationService.getUpcoming]');
    }
  }

  async updateStatus(consultationId: string, status: Consultation['status']) {
    console.time('[ConsultationService.updateStatus]');
    console.log('[ConsultationService.updateStatus] Updating consultation:', consultationId, 'to status:', status);
    try {
      const updateResult = await this.update(consultationId, {
        status,
        updated_at: new Date().toISOString()
      });
      console.log('[ConsultationService.updateStatus] Result:', updateResult);
      // Send follow-up email asynchronously (do not block the return)
      fetch('/.netlify/functions/sendStatusUpdateEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          consultationId,
          newStatus: status
        })
      }).catch(() => {});
      return updateResult;
    } catch (error) {
      console.error('[ConsultationService.updateStatus] Error:', error);
      throw error;
    } finally {
      console.timeEnd('[ConsultationService.updateStatus]');
    }
  }
}

export const consultationService = new ConsultationService();