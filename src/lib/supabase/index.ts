import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Supabase configuration
const supabaseUrl = 'https://menyracpmwczxhsrvlxz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lbnlyYWNwbXdjenhoc3J2bHh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg4MDMxOTQsImV4cCI6MjA1NDM3OTE5NH0.XCOvaAf1n-KXUwimRXEc3WW6eJ6K_5rm0C3ZFN0K7_Y';

// Create Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Export as default for compatibility
export default supabase;

// Export type
export type { Database } from './types';