// src/hooks/useJenniferChat.ts
import { useEffect, useRef, useState } from 'react';
import type { AIMessage } from '@/types/ai';
import { useNotificationStore } from '@/lib/store';
import { jenniferAI } from '@/services/ai/Jenniferclient';
import { supabase } from '@/lib/supabase/client';

/**
 * Hook to manage Jennifer AI chat, real-time syncing, and message sending.
 */
export function useJenniferChat() {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { addNotification } = useNotificationStore();
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    // ✅ Dynamically create a fresh channel instance (prevents double subscribe)
    const channel = supabase.channel('jennifer-chat', {
      config: {
        broadcast: { self: true },
        presence: { key: 'jenniferPresence' }
      }
    });

    channel
      .on('broadcast', { event: 'jennifer-response' }, ({ payload }) => {
        const response = payload?.message;
        if (response && isMounted.current) {
          setMessages(prev => [...prev, { role: 'assistant', content: response }]);
        }
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('✅ Jennifer chat channel subscribed');
          channel.track({ jennifer_active: true });
        }
      });

    channelRef.current = channel;

    return () => {
      isMounted.current = false;
      channelRef.current?.unsubscribe();
      console.log('🔴 Unsubscribed from Jennifer channel');
    };
  }, []);

  const sendMessage = async (content: string) => {
    const clean = content.trim();
    if (!clean) {
      addNotification('Please enter a message.', 'error');
      return;
    }

    try {
      setIsLoading(true);

      const userMessage: AIMessage = { role: 'user', content: clean };
      setMessages(prev => [...prev, userMessage]);

      const response = await jenniferAI.getResponse(clean);

      const assistantMessage: AIMessage = { role: 'assistant', content: response };
      setMessages(prev => [...prev, assistantMessage]);

      // ✅ Safely send broadcast via dynamic channel
      await channelRef.current?.send({
        type: 'broadcast',
        event: 'jennifer-response',
        payload: { message: response }
      });

      return response;
    } catch (err) {
      console.error('🛑 Jennifer AI error:', err);
      const msg = err instanceof Error ? err.message : 'Jennifer could not respond. Try again later.';
      addNotification(msg, 'error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    sendMessage,
    isLoading
  };
}