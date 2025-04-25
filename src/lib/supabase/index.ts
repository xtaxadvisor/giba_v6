import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Create Supabase client
export const supabase = createClient<Database>(import.meta.env.VITE_SUPABASE_URL!, import.meta.env.VITE_SUPABASE_ANON_KEY!, {
  auth: {
    detectSessionInUrl: false,
    persistSession: true
  }
});

// Export as default for compatibility
export default supabase;

// Export type
export type { Database } from './types';