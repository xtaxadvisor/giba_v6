// ✅ src/hooks/useJenniferChat.ts (Production Ready)
import { useEffect, useRef, useState } from 'react';
import type { AIMessage } from '@/types/ai';
import { useNotificationStore } from '@/lib/store';
import { jenniferAI } from '@/services/ai/Jenniferclient';
import { supabase } from '@/lib/supabase/client';

interface ExtendedAIMessage extends AIMessage {
  timestamp: number;
  sender: 'user' | 'assistant';
}

export function useJenniferChat() {
  const [messages, setMessages] = useState<ExtendedAIMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { addNotification } = useNotificationStore();
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    const channel = supabase.channel('jennifer-chat', {
      config: {
        broadcast: { self: true },
        presence: { key: 'jenniferPresence' }
      }
    });

    channel
      .on('broadcast', { event: 'jennifer-response' }, ({ payload }) => {
        const response = payload?.content;
        const timestamp = payload?.timestamp;
        const sender = payload?.sender;
        if (response && isMounted.current) {
          setMessages(prev => [
            ...prev,
            { role: 'assistant', content: response, timestamp: timestamp ?? Date.now(), sender: sender ?? 'assistant' }
          ]);
        }
      })
      .subscribe(status => {
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

      const userMessage: ExtendedAIMessage = {
        role: 'user',
        content: clean,
        timestamp: Date.now(),
        sender: 'user'
      };
      setMessages(prev => [...prev, userMessage]);

      let response = '';
      await jenniferAI.streamResponse(clean, (chunk: string) => {
        response += chunk;
      });

      const assistantMessage: ExtendedAIMessage = {
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
        sender: 'assistant'
      };
      setMessages(prev => [...prev, assistantMessage]);

      await channelRef.current?.send({
        type: 'broadcast',
        event: 'jennifer-response',
        payload: assistantMessage
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
