// src/hooks/useRealtime.ts
import { useState, useEffect } from 'react';
import { supabase, protaxChannel } from '@/lib/supabase/client';
import { realtimeService } from '@/services/realtime/realtimeService';
import { useNotificationStore } from '@/lib/store';

export function useRealtime() {
  const [presence, setPresence] = useState<Record<string, any>>({});
  const [isConnected, setIsConnected] = useState(false);
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    let isMounted = true;

    const setupRealtime = async () => {
      try {
        const {
          data: { user },
          error: userError
        } = await supabase.auth.getUser();

        if (userError || !user) {
          throw new Error(userError?.message || 'User not authenticated');
        }

        const subscription = protaxChannel
          .on('presence', { event: 'sync' }, () => {
            if (isMounted) {
              const state = protaxChannel.presenceState();
              setPresence(state);
              setIsConnected(true);
              console.log('🔄 Presence state synced:', state);
            }
          })
          .subscribe(async (status) => {
            if (status === 'SUBSCRIBED') {
              console.log('🟢 Realtime channel subscribed');
              await protaxChannel.track({
                online_at: new Date().toISOString(),
                user_id: user.id
              });
            }
          });

        return () => {
          isMounted = false;
          subscription.unsubscribe();
        };
      } catch (error: any) {
        console.error('⚠️ Realtime setup error:', error);
        addNotification('❌ Failed to connect to realtime service', 'error');
      }
    };

    setupRealtime();
  }, [addNotification]);

  const sendMessage = async (event: string, payload: any = {}) => {
    try {
      await realtimeService.sendMessage(event, payload);
    } catch (error) {
      console.error('⚠️ Failed to send message:', error);
      addNotification('❌ Failed to send message', 'error');
    }
  };

  const updatePresence = async (data: Record<string, any>) => {
    try {
      await realtimeService.updatePresence(data);
    } catch (error) {
      console.error('⚠️ Failed to update presence:', error);
      addNotification('❌ Failed to update presence', 'error');
    }
  };

  return {
    presence,
    isConnected,
    sendMessage,
    updatePresence
  };
}