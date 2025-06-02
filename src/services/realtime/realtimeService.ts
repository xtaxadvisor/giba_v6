// src/hooks/useJenniferChat.ts

import { useEffect, useRef, useState } from 'react';
import type { AIMessage } from '@/types/ai';
import { useNotificationStore } from '@/lib/store';
import { jenniferAI } from '@/services/ai/Jenniferclient';
import { supabase } from '@/lib/supabase/client';

// Optional exportable realtimeService if you want global use
export const realtimeService = {
  async sendMessage(event: string, payload: any) {
    await supabase.channel('jennifer-chat').send({
      type: 'broadcast',
      event,
      payload
    });
  },

  async updatePresence(presence: Record<string, any>) {
    await supabase.channel('jennifer-chat').track(presence);
  },

  async unsubscribe() {
    await supabase.removeChannel(supabase.channel('jennifer-chat'));
  }
};

export function useJenniferChat() {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { addNotification } = useNotificationStore();

  const isMounted = useRef(true);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    isMounted.current = true;

    const channel = supabase.channel('jennifer-chat', {
      config: {
        broadcast: { self: true },
        presence: { key: 'jennifer' }
      }
    });

    channelRef.current = channel;

    channel
      .on('broadcast', { event: 'jennifer-response' }, (payload) => {
        const message = payload?.payload?.message;
        if (message && isMounted.current) {
          setMessages((prev) => [...prev, { role: 'assistant', content: message }]);
        }
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('✅ Subscribed to jennifer-chat');
          channel.track({ jennifer_active: true });
        }
      });

    return () => {
      isMounted.current = false;
      channel.unsubscribe();
      console.log('🔴 Unsubscribed from jennifer-chat');
    };
  }, []);

  const sendMessage = async (content: string) => {
    const trimmed = content.trim();
    if (!trimmed) {
      addNotification('Please enter a message.', 'error');
      return;
    }

    try {
      setIsLoading(true);
      setMessages((prev) => [...prev, { role: 'user', content: trimmed }]);

      const response = await jenniferAI.getResponse(trimmed);
      setMessages((prev) => [...prev, { role: 'assistant', content: response }]);

      await channelRef.current?.send({
        type: 'broadcast',
        event: 'jennifer-response',
        payload: { message: response }
      });

      return response;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Jennifer could not respond. Try again later.';
      console.error('🛑 Jennifer error:', err);
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