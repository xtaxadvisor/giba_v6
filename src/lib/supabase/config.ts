import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Validate environment variables
function validateConfig() {
  const missing = [];
  if (!import.meta.env.VITE_SUPABASE_URL) missing.push('VITE_SUPABASE_URL');
  if (!import.meta.env.VITE_SUPABASE_ANON_KEY) missing.push('VITE_SUPABASE_ANON_KEY');
  
  if (missing.length > 0) {
    console.warn('Missing Supabase environment variables:', missing);
    return false;
  }

  return true;
}

// Create Supabase client
const supabaseClient = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL || 'https://asdthnxphqjpxzyhpylr.supabase.co',
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzZHRobnhwaHFqcHh6eWhweWxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkwNDg4MDMsImV4cCI6MjA1NDYyNDgwM30.AGjxQM7QkIUA6d0jgJa4uaXQlJX8r9Bya9zC7B7F9qc',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storage: localStorage,
      storageKey: 'supabase.auth.token'
    },
    db: {
      schema: 'public'
    }
  }
);

// Validate configuration
validateConfig();

// Export the client as default
export default supabaseClient;