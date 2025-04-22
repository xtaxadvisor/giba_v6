import { supabase } from './client';
import { useNotificationStore } from '../store';

class DatabaseConnectionManager {
  private static instance: DatabaseConnectionManager;
  private retryCount = 0;
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 1000;
  private isConnected = false;
  private checkInterval: NodeJS.Timeout | null = null;

  private constructor() {
    this.initializeConnection();
  }

  public static getInstance(): DatabaseConnectionManager {
    if (!DatabaseConnectionManager.instance) {
      DatabaseConnectionManager.instance = new DatabaseConnectionManager();
    }
    return DatabaseConnectionManager.instance;
  }

  private async initializeConnection() {
    try {
      await this.checkConnection();
      
      // Set up periodic connection checks
      if (!this.checkInterval) {
        this.checkInterval = setInterval(() => {
          if (!this.isConnected) {
            this.checkConnection().catch(console.error);
          }
        }, 30000); // Check every 30 seconds if disconnected
      }
    } catch (error) {
      console.error('Failed to initialize connection:', error);
    }
  }

  async checkConnection(): Promise<boolean> {
    try {
      // Test connection with public data
      const { error } = await supabase
        .from('public_data')
        .select('count')
        .limit(1)
        .maybeSingle();

      if (error) {
        throw error;
      }

      this.isConnected = true;
      this.retryCount = 0;
      return true;
    } catch (error) {
      this.isConnected = false;
      
      if (this.retryCount < this.MAX_RETRIES) {
        this.retryCount++;
        await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY * this.retryCount));
        return this.checkConnection();
      }
      
      useNotificationStore.getState().addNotification(
        'Database connection error. Please try again later.',
        'error'
      );
      
      return false;
    }
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  resetRetryCount(): void {
    this.retryCount = 0;
  }

  cleanup(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }
}

export const supabaseConnectionManager = DatabaseConnectionManager.getInstance();