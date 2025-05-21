import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { useMessages as useMessagesHook } from '../../hooks/useMessages';
import { useAuth } from '../../contexts/AuthContext';
import { useEffect, useRef, useState } from 'react';
import { supabase } from '../../lib/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';
import { useToast } from '@chakra-ui/react';

// Define the SendMessageDTO type
type SendMessageDTO = {
  senderId: string;
  recipientId: string;
  content: string;
  attachments?: File[]; // Optional attachments property
  read: boolean;
};

export function useMessages() {
// Removed duplicate interface declaration
  
    const sendMessage = async (message: SendMessageDTO): Promise<{ error?: string | null }> => {
    try {
      // Simulate sending a message (replace with actual implementation)
      console.log('Sending message:', message);
      return { error: null };
    } catch (err) {
      return { error: (err as Error).message };
    }
  };

  return { sendMessage, isSending: false };
}
export function MessagingCenter({ recipientId }: { recipientId: string }) {
  const { sendMessage, isSending } = useMessagesHook();
  const { user } = useAuth();
  const senderId = user?.id;
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [recipientName, setRecipientName] = useState('Recipient');
  const [unreadCount, setUnreadCount] = useState(0);
  const [draft, setDraft] = useState('');
  const [lastSent, setLastSent] = useState<string | null>(null);
  const toast = useToast();
  const [isOnline, setIsOnline] = useState(false);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Loading messaging interface...
      </div>
    );
  }

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
  }, [recipientId, messageEndRef]);

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

  useEffect(() => {
    const presenceChannel = supabase.channel('user-status')
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

      const { data, error } = await supabase
        .from('message_drafts')
        .select('content')
        .eq('sender_id', senderId)
        .eq('recipient_id', recipientId)
        .maybeSingle();

      if (data?.content) {
        setDraft(data.content);
      } else {
        const local = localStorage.getItem(key);
        if (local) setDraft(local);
      }
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
        payload: { senderId },
      });
    }, 400);
  };

const handleSendMessage = async (messageContent: string, attachments?: File[]) => {
  if (!recipientId || !senderId) return;
  if (!messageContent.trim()) return;

  const message = {
    senderId,
    recipientId,
    content: messageContent,
    attachments,
    read: false
  } as SendMessageDTO;

  const { error } = await sendMessage(message);
  if (error) {
    console.error(error);
    return;
  }

  localStorage.removeItem(`${senderId}_${recipientId}_draft`);
  const { error: delError } = await supabase.from('message_drafts')
    .delete()
    .match({ sender_id: senderId, recipient_id: recipientId });
  if (delError) {
    console.error("Error deleting draft from Supabase:", delError);
  }
  setDraft('');

  // Send email notification via Supabase Edge Function
  try {
    const { data: recipientProfile, error: recipientError } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', recipientId)
      .maybeSingle();

    const recipientEmail = recipientProfile?.email;
    if (!recipientEmail) {
      console.error("Could not find recipient email.");
      return;
    }

    const emailRes = await fetch("https://asdthnxphqjpxzyhpylr.functions.supabase.co/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: recipientEmail,
        subject: "New Message from ProTax Advisors",
        body: `<p>You’ve received a new message in your portal:</p><p>${messageContent}</p>`,
      }),
    });
    const result = await emailRes.json();
    if (!emailRes.ok) {
      console.error("Email send error:", result.error);
    } else {
      toast({
        title: "Message sent.",
        description: "An email notification was delivered.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  } catch (emailErr) {
    console.error("Unexpected email error:", emailErr);
  }

  setLastSent(new Date().toISOString());
  const sentLog = {
    id: Date.now(),
    content: messageContent,
    timestamp: new Date().toISOString(),
    recipientId,
    senderId,
  };
  const historyKey = `sent_messages_${senderId}_${recipientId}`;
  const prevMessages = JSON.parse(localStorage.getItem(historyKey) || '[]');
  localStorage.setItem(historyKey, JSON.stringify([...prevMessages, sentLog]));
};
  const deleteDraftAndLogMessage = async () => {
    const { error: delError } = await supabase.from('message_drafts')
      .delete()
      .match({ sender_id: senderId, recipient_id: recipientId });
    if (delError) {
      console.error("Error deleting draft from Supabase:", delError);
    }
    setDraft('');

    setLastSent(new Date().toISOString());
    const sentLog = {
      id: Date.now(),
      content: draft,
      timestamp: new Date().toISOString(),
      recipientId,
      senderId,
    };
    const historyKey = `sent_messages_${senderId}_${recipientId}`;
    const prevMessages = JSON.parse(localStorage.getItem(historyKey) || '[]');
    localStorage.setItem(historyKey, JSON.stringify([...prevMessages, sentLog]));
  };

  deleteDraftAndLogMessage();

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  });

  try {
    return (
      <div className="h-[calc(100vh-12rem)] flex flex-col bg-white rounded-lg shadow">
        <div className="border-b border-gray-200 p-4">
          <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
          <p className="text-sm text-gray-500">Chatting with: {recipientName || 'Recipient'}
            <span className={`ml-2 text-xs ${isOnline ? 'text-green-500' : 'text-gray-400'}`}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </p>
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

        {user?.id && recipientId ? (
          <div className="p-4 border-t border-gray-200">
            <MessageInput
              value={draft}
              onChange={async (val: string) => {
                setDraft(val);
                localStorage.setItem(`${senderId}_${recipientId}_draft`, val);
                if (senderId && recipientId) {
                  // Save draft to Supabase
                  const { error: upsertError } = await supabase.from('message_drafts')
                    .upsert(
                      { sender_id: senderId, recipient_id: recipientId, content: val },
                      { onConflict: 'sender_id,recipient_id' }
                    );
                  if (upsertError) {
                    console.error("Error upserting draft to Supabase:", upsertError);
                  }
                  // Broadcast typing status
                  broadcastTyping();
                }
              }}
              onSendMessage={handleSendMessage}
              isLoading={isSending}
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
  } catch (err) {
    return <div className="p-4 text-red-600">Something went wrong loading the messaging interface.</div>;
  }
};