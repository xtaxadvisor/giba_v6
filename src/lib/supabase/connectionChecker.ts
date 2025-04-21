import { supabase } from './client';
import { useNotificationStore } from '../store';

export async function checkSupabaseConnection() {
  try {
    // First try direct RPC call
    const { data: rpcData, error: rpcError } = await supabase.rpc('test_connection');
    
    if (!rpcError && rpcData?.success) {
      useNotificationStore.getState().addNotification(
        'Successfully connected to database',
        'success'
      );
      return true;
    }

    // Fallback to edge function
    const response = await fetch('/.netlify/functions/test-connection', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
      }
    });

    if (!response.ok) {
      throw new Error('Connection test failed');
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Connection test failed');
    }

    useNotificationStore.getState().addNotification(
      'Successfully connected to database',
      'success'
    );
    
    return true;
  } catch (error) {
    console.error('Connection test failed:', error);
    useNotificationStore.getState().addNotification(
      'Database connection error. Please try again later.',
      'error'
    );
    return false;
  }
}

export function validateSupabaseConfig() {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.error('Missing Supabase configuration');
    useNotificationStore.getState().addNotification(
      'Supabase configuration is incomplete',
      'error'
    );
    return false;
  }

  try {
    // Validate URL format
    new URL(url);
    
    // Validate key format (basic JWT structure)
    if (key.split('.').length !== 3) {
      throw new Error('Invalid API key format');
    }

    return true;
  } catch (error) {
    console.error('Invalid Supabase configuration:', error);
    useNotificationStore.getState().addNotification(
      'Invalid Supabase configuration',
      'error'
    );
    return false;
  }
}