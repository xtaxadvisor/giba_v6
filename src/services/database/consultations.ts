import { DatabaseService } from './index';
import type { Database } from '../../lib/supabase/types';
import { supabase } from '../../lib/supabase/client';

type Consultation = Database['public']['Tables']['consultations']['Row'];

class ConsultationService extends DatabaseService<'consultations'> {
  constructor() {
    super('consultations');
  }

  async getUpcoming(userId: string) {
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

    if (error) throw error;
    return data;
  }

  async updateStatus(consultationId: string, status: Consultation['status']) {
    const updateResult = await this.update(consultationId, {
      status,
      updated_at: new Date().toISOString()
    });
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
  }
}

export const consultationService = new ConsultationService();