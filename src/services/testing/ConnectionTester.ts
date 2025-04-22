import { supabase } from '../../lib/supabase/client';
import { useNotificationStore } from '../../lib/store';

export class ConnectionTester {
  private static instance: ConnectionTester;

  private constructor() {}

  public static getInstance(): ConnectionTester {
    if (!ConnectionTester.instance) {
      ConnectionTester.instance = new ConnectionTester();
    }
    return ConnectionTester.instance;
  }

  async testSupabaseConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      // Test basic connection first
      const { error } = await supabase.rpc('test_connection');

      if (error) {
        console.error('Connection test error:', error);
        return {
          success: false,
          error: error.message
        };
      }

      // Test basic query
      const { error: queryError } = await supabase
        .from('clients')
        .select('count')
        .maybeSingle();

      if (queryError && queryError.code !== 'PGRST116') {
        // PGRST116 means no rows found, which is OK
        console.error('Query test error:', queryError);
        return {
          success: false,
          error: queryError.message
        };
      }

      return { success: true };
    } catch (error) {
      console.error('Connection test error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Connection failed'
      };
    }
  }

  async testAll(): Promise<Record<string, { success: boolean; error?: string }>> {
    const results = {
      supabase: await this.testSupabaseConnection()
    };

    // Log results to notification system
    Object.entries(results).forEach(([service, result]) => {
      if (!result.success) {
        useNotificationStore.getState().addNotification(
          `${service} connection failed: ${result.error}`,
          'error'
        );
      }
    });

    return results;
  }
}

export const connectionTester = ConnectionTester.getInstance();