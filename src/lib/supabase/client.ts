import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { useNotificationStore } from '../store';

// Single source of truth for Supabase configuration
const SUPABASE_CONFIG = {
  url: import.meta.env.VITE_SUPABASE_URL || 'https://asdthnxphqjpxzyhpylr.supabase.co',
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzZHRobnhwaHFqcHh6eWhweWxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkwNDg4MDMsImV4cCI6MjA1NDYyNDgwM30.AGjxQM7QkIUA6d0jgJa4uaXQlJX8r9Bya9zC7B7F9qc'
};

// Create Supabase client with enhanced configuration
export const supabase = createClient<Database>(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
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
        .single();

      if (!publicError) {
        useNotificationStore.getState().addNotification(
          'Successfully connected to database',
          'success'
        );
        return true;
      }

      // If that fails, try the RPC test
      const { data, error } = await supabase.rpc('test_connection');
      
      if (error) {
        throw error;
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