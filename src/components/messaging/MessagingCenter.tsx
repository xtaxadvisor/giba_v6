import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { useMessages } from '../../hooks/useMessages';
import { useSession } from '../../contexts/AuthContext';
import { useEffect, useRef, useState } from 'react';
import { supabase } from '../../lib/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

export function MessagingCenter({ recipientId }: { recipientId: string }) {
  const { sendMessage, isSending } = useMessages();
  const { session } = useSession();
  const senderId = session?.user?.id;
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [recipientName, setRecipientName] = useState('Recipient');
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!recipientId) return;
    supabase
      .from('profiles')
      .select('full_name')
      .eq('id', recipientId)
      .maybeSingle()
      .then(({ data }: { data: { full_name?: string } | null }) => {
        if (data?.full_name) {
          setRecipientName(data.full_name);
        }
      });
  }, [recipientId]);

  useEffect(() => {
    if (!recipientId || !senderId) return;

    supabase
      .from('messages')
      .select('id', { count: 'exact', head: true })
      .eq('recipient_id', senderId)
      .eq('sender_id', recipientId)
      .eq('read', false)
      .then(({ count }) => {
        setUnreadCount(count || 0);
      });
  }, [recipientId, senderId]);

  useEffect(() => {
    if (!recipientId || !senderId) return;

    const channel: RealtimeChannel = supabase
      .channel('typing-status')
      .on('broadcast', { event: 'typing' }, ((payload: any) => {
        if (payload.senderId === recipientId) {
          setIsTyping(true);
          setTimeout(() => setIsTyping(false), 2000);
        }
      }) as Parameters<typeof channel.on>[2]);

    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [recipientId, senderId]);

  const handleSendMessage = (content: string, attachments?: File[]) => {
    if (!recipientId || !senderId) return;

    sendMessage({
      recipientId,
      senderId,
      content,
      attachments: attachments?.map(file => file.name)
    });
  };

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  });

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col bg-white rounded-lg shadow">
      <div className="border-b border-gray-200 p-4">
        <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
        <p className="text-sm text-gray-500">Chatting with: {recipientName || 'Recipient'}</p>
        {unreadCount > 0 && (
          <span className="ml-2 inline-block bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
            {unreadCount}
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <MessageList recipientId={recipientId} senderId={senderId} />
        <div ref={messageEndRef} />
      </div>

      {isTyping && (
        <div className="text-sm text-gray-400 px-4 pb-2 italic">
          {recipientName || 'User'} is typing...
        </div>
      )}

      {senderId && recipientId ? (
        <div className="p-4 border-t border-gray-200">
          <MessageInput
            onSendMessage={handleSendMessage}
            isLoading={isSending}
          />
        </div>
      ) : (
        <div className="p-4 text-sm text-gray-400 text-center italic">
          Cannot send messages without a valid sender or recipient.
        </div>
      )}
    </div>
  );
}