import { useEffect, useRef, useState } from 'react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase/client';
import { useToast } from '@chakra-ui/react';
import { RealtimeChannel } from '@supabase/supabase-js';

interface SendMessageDTO {
  senderId: string;
  recipientId: string;
  content: string;
  attachments?: File[];
  read: boolean;
}

export function MessagingCenter({ recipientId }: { recipientId: string }) {
  const { user } = useAuth();
  const senderId = user?.id;
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [recipientName, setRecipientName] = useState('Recipient');
  const [unreadCount, setUnreadCount] = useState(0);
  const [draft, setDraft] = useState('');
  const [lastSent, setLastSent] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(false);
  const toast = useToast();

  const sendMessage = async (message: SendMessageDTO) => {
    try {
      const { error } = await supabase.from('messages').insert([message]);
      return { error: error?.message || null };
    } catch (err) {
      return { error: (err as Error).message };
    }
  };

  useEffect(() => {
    if (!recipientId) return;
    supabase
      .from('profiles')
      .select('full_name')
      .eq('id', recipientId)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.full_name) setRecipientName(data.full_name);
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
      .then(({ count }) => setUnreadCount(count || 0));
  }, [recipientId, senderId]);

  useEffect(() => {
    if (!recipientId || !senderId) return;
    const channel: RealtimeChannel = supabase
      .channel('typing-status')
      .on('broadcast', { event: 'typing' }, (payload: any) => {
        if (payload.senderId === recipientId) {
          setIsTyping(true);
          setTimeout(() => setIsTyping(false), 2000);
        }
      });
    channel.subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [recipientId, senderId]);

  useEffect(() => {
  const presenceChannel = supabase
    .channel('user-status')
    .on('broadcast', { event: 'online' }, (payload) => {
      if (payload.userId === recipientId) setIsOnline(true);
    })
    .on('broadcast', { event: 'offline' }, (payload) => {
      if (payload.userId === recipientId) setIsOnline(false);
    });

  presenceChannel.subscribe();

  return () => {
    supabase.removeChannel(presenceChannel);
  };
}, [recipientId]);

  useEffect(() => {
    const key = `${senderId}_${recipientId}_draft`;
    async function fetchDraft() {
      if (!senderId || !recipientId) return;
      const { data } = await supabase
        .from('message_drafts')
        .select('content')
        .eq('sender_id', senderId)
        .eq('recipient_id', recipientId)
        .maybeSingle();
      setDraft(data?.content || localStorage.getItem(key) || '');
    }
    fetchDraft();
  }, [senderId, recipientId]);

  let typingTimeout: NodeJS.Timeout;
  const broadcastTyping = () => {
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      supabase.channel('typing-status').send({
        type: 'broadcast',
        event: 'typing',
        payload: { senderId }
      });
    }, 400);
  };

  const handleSendMessage = async (messageContent: string, attachments?: File[]) => {
    if (!senderId || !recipientId || !messageContent.trim()) return;

    const message: SendMessageDTO = {
      senderId,
      recipientId,
      content: messageContent,
      attachments,
      read: false
    };

    const { error } = await sendMessage(message);
    if (error) return console.error(error);

    setDraft('');
    localStorage.removeItem(`${senderId}_${recipientId}_draft`);
    await supabase.from('message_drafts').delete().match({ sender_id: senderId, recipient_id: recipientId });

    const { data: recipientProfile } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', recipientId)
      .maybeSingle();

    if (recipientProfile?.email) {
      await fetch("https://asdthnxphqjpxzyhpylr.functions.supabase.co/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: recipientProfile.email,
          subject: "New Message from ProTax Advisors",
          body: `<p>You’ve received a new message:</p><p>${messageContent}</p>`
        })
      });
      toast({ title: "Message sent", status: "success", duration: 3000, isClosable: true });
    }
    setLastSent(new Date().toISOString());
  };

  useEffect(() => {
    if (messageEndRef.current) messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
  });

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col bg-white rounded-lg shadow">
      <div className="border-b p-4">
        <h2 className="text-lg font-semibold">Messages</h2>
        <p className="text-sm text-gray-500">
          Chatting with: {recipientName}
          <span className={`ml-2 text-xs ${isOnline ? 'text-green-500' : 'text-gray-400'}`}>
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </p>
        {unreadCount > 0 && (
          <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
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
          {recipientName} is typing...
        </div>
      )}

      {user?.id && recipientId ? (
        <div className="p-4 border-t">
          <MessageInput
            value={draft}
            onChange={async (val: string) => {
              setDraft(val);
              localStorage.setItem(`${senderId}_${recipientId}_draft`, val);
              await supabase.from('message_drafts').upsert(
                { sender_id: senderId, recipient_id: recipientId, content: val },
                { onConflict: 'sender_id,recipient_id' }
              );
              broadcastTyping();
            }}
            onSendMessage={handleSendMessage}
            isLoading={false}
          />
          {lastSent && (
            <div className="text-xs text-green-600 px-4 pb-2 italic">
              Last message sent at {new Date(lastSent).toLocaleTimeString()}
            </div>
          )}
        </div>
      ) : (
        <div className="p-4 text-sm text-gray-400 text-center italic">
          Cannot send messages without a valid sender or recipient.
        </div>
      )}
    </div>
  );
}