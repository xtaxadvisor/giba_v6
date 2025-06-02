// useJenniferChat.ts (Final Functional + Enhanced)
import { useState, useCallback } from 'react';
import { useNotificationStore } from '@/lib/store';
import { jenniferAI } from '@/services/ai/JennifeAIclient';
import type { AIMessage } from '@/types/ai';

export function useJenniferChat() {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { addNotification } = useNotificationStore();

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) {
      addNotification('Please enter a message.', 'info');
      return;
    }

    try {
      setIsLoading(true);

      const userMessage: AIMessage = { role: 'user', content };
      setMessages(prev => [...prev, userMessage]);

      const response = await jenniferAI.getResponse(content);

      const assistantMessage: AIMessage = {
        role: 'assistant',
        content: response
      };
      setMessages(prev => [...prev, assistantMessage]);

      return response;
    } catch (error: any) {
      console.error('Jennifer chat error:', error);
      addNotification(
        error instanceof Error ? error.message : 'Unable to get a response. Please try again.',
        'error'
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [addNotification]);

  return {
    messages,
    sendMessage,
    isLoading
  };
}