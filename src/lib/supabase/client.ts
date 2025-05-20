import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { useNotificationStore } from '../store';


const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    'Missing VITE_SUPABASE_URL and/or VITE_SUPABASE_ANON_KEY environment variables'
  );
}

const SUPABASE_CONFIG = {
  url: SUPABASE_URL,
  anonKey: SUPABASE_ANON_KEY,
};

// Create Supabase client with enhanced configuration
export const supabase = createClient<Database>(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey, {
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
});

// Initialize realtime channel
export const protaxChannel = supabase.channel('protax-channel', {
  config: {
    broadcast: { self: true },
    presence: { key: 'userPresence' }
  }
});

// Test connection function with improved error handling
export async function testConnection(retries = 3): Promise<boolean> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      // First try a simple query that doesn't require auth
      const { error: publicError } = await supabase
        .from('public_data')
        .select('count')
        .maybeSingle();

      if (!publicError) {
        useNotificationStore.getState().addNotification(
          'Successfully connected to database',
          'success'
        );
        return true;
      }

      // If that fails, try the RPC test
      const { data, error } = await supabase.rpc('test_connection');

      if (error || !data) {
        throw error ?? new Error('No data returned from test_connection RPC');
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Connection test failed');
      }

      useNotificationStore.getState().addNotification(
        'Successfully connected to database',
        'success'
      );

      return true;
    } catch (error) {
      console.error(`Connection attempt ${attempt} failed:`, error);
      
      if (attempt === retries) {
        useNotificationStore.getState().addNotification(
          'Database connection failed. Please try again later.',
          'error'
        );
        return false;
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }

  return false;
}