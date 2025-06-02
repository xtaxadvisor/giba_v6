// src/lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { useNotificationStore } from '../store';

// ✅ Load env vars
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('❌ Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY.');
}

// ✅ Initialize Supabase client
export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      storageKey: 'supabase.auth.token'
    },
    realtime: {
      params: {
        eventsPerSecond: 2
      }
    },
    global: {
      headers: {
        'x-client-info': 'protaxadvisors-web'
      }
    },
    db: {
      schema: 'public'
    }
  }
);

// ✅ Create reusable realtime channel (subscribe elsewhere ONCE!)
export const protaxChannel = supabase.channel('protax-channel', {
  config: {
    broadcast: { self: true },
    presence: { key: 'userPresence' }
  }
});

// ❗ Do NOT call .subscribe() here. Call it once inside useEffect in JenniferChat or Providers.

// ✅ Optional DB connection check logic
export async function testConnection(retries = 3): Promise<boolean> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const { error: publicError } = await supabase
        .from('public_data')
        .select('count')
        .maybeSingle();

      if (!publicError) {
        useNotificationStore.getState().addNotification('✅ Public data access OK', 'success');
        return true;
      }

      const { data, error } = await supabase.rpc('test_connection');

      if (error || !data?.success) {
        throw new Error(data?.error || error?.message || 'RPC test failed');
      }

      useNotificationStore.getState().addNotification('✅ RPC test passed', 'success');
      return true;

    } catch (err: any) {
      console.error(`❌ DB test failed (try ${attempt}):`, err?.message || err);
      if (attempt === retries) {
        useNotificationStore.getState().addNotification(
          '🚨 Database connection failed. Try again later.',
          'error'
        );
        return false;
      }
      await new Promise(res => setTimeout(res, 1000 * attempt));
    }
  }
  return false;
}