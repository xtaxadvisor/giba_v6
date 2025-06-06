import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';
import { testConnection } from '../../lib/supabase/client';
import { useNotificationStore } from '../../lib/store';

export function ConnectionStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { addNotification } = useNotificationStore();

  const checkConnection = async () => {
    setIsLoading(true);
    try {
      const connected = await testConnection();
      setIsConnected(connected);
      
      if (!connected) {
        addNotification(
          'Unable to connect to database. Please check your connection.',
          'error'
        );
      }
    } catch (error) {
      console.error('Connection check failed:', error);
      setIsConnected(false);
      addNotification(
        'Connection check failed. Please try again.',
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkConnection();

    // Set up periodic connection checks
    const interval = setInterval(checkConnection, 5 * 60 * 1000); // Check every 5 minutes
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="p-4 bg-white rounded-lg shadow-lg">
        <div className="flex items-center space-x-2">
          {isConnected === null ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500" />
          ) : isConnected ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <XCircle className="h-5 w-5 text-red-500" />
          )}
          <span className="font-medium">
            {isConnected === null
              ? 'Checking connection...'
              : isConnected
              ? 'Connected to Supabase'
              : 'Connection failed'}
          </span>
          <Button
            variant="outline"
            size="sm"
            icon={RefreshCw}
            onClick={checkConnection}
            disabled={isLoading}
            className="ml-2"
          >
            {isLoading ? 'Checking...' : 'Retry'}
          </Button>
        </div>
      </div>
    </div>
  );
}