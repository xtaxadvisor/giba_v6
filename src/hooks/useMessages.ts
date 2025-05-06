import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { messageService } from '../services/api/messages';
import { useNotificationStore } from '../lib/store';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
// Removed unused and non-existent 'Message' import

export function useMessages() {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();

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

  const sendMessageMutation = useMutation({
    mutationFn: messageService.send,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      addNotification('Message sent successfully', 'success');
    },
    onError: () => {
      addNotification('Failed to send message', 'error');
    }
  });

  const markAsReadMutation = useMutation({
    mutationFn: messageService.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    }
  });

  return {
    messages,
    isLoading,
    sendMessage: sendMessageMutation.mutate,
    markAsRead: markAsReadMutation.mutate,
    isSending: sendMessageMutation.isPending
  };
}