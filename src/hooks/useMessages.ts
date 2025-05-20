import { useQuery, useQueryClient } from '@tanstack/react-query';
import { messageService } from '../services/api/messages';
import { useNotificationStore } from '../lib/store';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
// Removed unused and non-existent 'Message' import

export function useMessages() {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();
  const { data, error, isLoading: isMessagesLoading } = useQuery({
    queryKey: ['messages', 'all'],
    queryFn: async () => {
      const response = await messageService.getThreads();
      return response;
    }
  });

  useEffect(() => {
    const channel = supabase
      .channel('messages-insert-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          console.log('New message received:', payload.new);
          queryClient.invalidateQueries({ queryKey: ['messages'] });

          // Play notification sound
          const audioCtx = new AudioContext();
          const oscillator = audioCtx.createOscillator();
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // pitch
          oscillator.connect(audioCtx.destination);
          oscillator.start();
          oscillator.stop(audioCtx.currentTime + 0.2); // duration
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const { data: messages, isLoading } = useQuery({
    queryKey: ['messages'],
    queryFn: messageService.getThreads
  });

  type SendMessageDTO = {
    content: string;
    recipientId: string;
  };

  const sendMessage = async (message: SendMessageDTO): Promise<{ error?: string | null }> => {
    try {
      // Simulate sending a message (replace with actual implementation)
      console.log('Sending message:', message);
      return { error: null };
    } catch (err) {
      return { error: (err as Error).message };
    }
  };

  const markAsReadMutation = useMutation({
    mutationFn: messageService.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    }
  });

  return {
    messages,
    isLoading: isMessagesLoading,
    sendMessage,
    markAsRead: markAsReadMutation.mutate,
    isSending: false
  };
}
function useMutation({ mutationFn, onSuccess }: { mutationFn: (messageId: string) => Promise<void>; onSuccess: () => void; }) {
  const queryClient = useQueryClient();

  const mutate = async (messageId: string) => {
    try {
      await mutationFn(messageId);
      onSuccess();
    } catch (error) {
      console.error('Mutation failed:', error);
    }
  };

  return { mutate };
}
