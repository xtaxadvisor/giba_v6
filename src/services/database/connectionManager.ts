import { supabase } from '../../lib/supabase/client';
import { useNotificationStore } from '../../lib/store';

class DatabaseConnectionManager {
  private static instance: DatabaseConnectionManager;
  private retryCount = 0;
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 1000;

  private constructor() {}

  public static getInstance(): DatabaseConnectionManager {
    if (!DatabaseConnectionManager.instance) {
      DatabaseConnectionManager.instance = new DatabaseConnectionManager();
    }
    return DatabaseConnectionManager.instance;
  }

  async executeQuery<T>(
    queryFn: () => Promise<{ data: T | null; error: any }>
  ): Promise<T> {
    console.time('[DB.executeQuery]');
    console.log('[DB.executeQuery] Starting query...');
    try {
      const { data, error } = await queryFn();

      if (error) {
        if (this.retryCount < this.MAX_RETRIES) {
          this.retryCount++;
          console.log('[DB.executeQuery] Retry attempt:', this.retryCount, 'Error:', error);
          await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY * this.retryCount));
          const result = await this.executeQuery(queryFn);
          console.timeEnd('[DB.executeQuery]');
          return result;
        }
        console.error('[DB.executeQuery] Query failed after max retries:', error);
        throw error;
      }

      this.retryCount = 0;
      console.log('[DB.executeQuery] Query success:', data);
      console.timeEnd('[DB.executeQuery]');
      return data as T;
    } catch (error) {
      console.error('[DB.executeQuery] Query failed:', error);
      useNotificationStore.getState().addNotification(
        'Failed to fetch data. Please try again.',
        'error'
      );
      console.timeEnd('[DB.executeQuery]');
      throw error;
    }
  }

  async healthCheck(): Promise<boolean> {
    console.time('[DB.healthCheck]');
    console.log('[DB.healthCheck] Checking Supabase connectivity...');
    try {
      const { error } = await supabase.from('profiles').select('count').single();
      if (!error) {
        console.log('[DB.healthCheck] Healthy');
        console.timeEnd('[DB.healthCheck]');
        return true;
      } else {
        console.warn('[DB.healthCheck] Unhealthy', error);
        console.timeEnd('[DB.healthCheck]');
        return false;
      }
    } catch (e) {
      console.warn('[DB.healthCheck] Unhealthy (exception)', e);
      console.timeEnd('[DB.healthCheck]');
      return false;
    }
  }
}

export const dbConnectionManager = DatabaseConnectionManager.getInstance();