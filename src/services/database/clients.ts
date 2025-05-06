import { DatabaseService } from './index';
// Removed duplicate import of Database
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

const SUPABASE_ANON_KEY =
  typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY
    ? import.meta.env.VITE_SUPABASE_ANON_KEY
    : process.env.VITE_SUPABASE_ANON_KEY;

import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../lib/supabase/types';
const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);

type Client = Database['public']['Tables']['clients']['Row'];

class ClientService extends DatabaseService<'clients'> {
  constructor() {
    super('clients');
  }

  async getByUserId(userId: string) {
    console.time('[ClientService.getByUserId]');
    console.log('[ClientService.getByUserId] Looking up user ID:', userId);
    try {
      const { data, error } = await supabase
        .from(this.table)
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('[ClientService.getByUserId] Error:', error);
        throw error;
      }
      if (!data) {
        console.warn('[ClientService.getByUserId] No client found for user ID:', userId);
      } else {
        console.log('[ClientService.getByUserId] Success:', data);
      }
      return data;
    } finally {
      console.timeEnd('[ClientService.getByUserId]');
    }
  }

  async updateStatus(clientId: string, status: Client['status']) {
    console.time('[ClientService.updateStatus]');
    console.log('[ClientService.updateStatus] Updating status for client ID:', clientId);
    try {
      const result = await this.update(clientId, {
        status,
        updated_at: new Date().toISOString()
      });
      console.log('[ClientService.updateStatus] Update result:', result);
      return result;
    } catch (error) {
      console.error('[ClientService.updateStatus] Error:', error);
      throw error;
    } finally {
      console.timeEnd('[ClientService.updateStatus]');
    }
  }
}

export const clientService = new ClientService();