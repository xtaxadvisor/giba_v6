import { formatDistanceToNow } from 'date-fns';
import { useMessages } from '../../hooks/useMessages';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase/client';

type MessageType = {
  id: string;
  senderId: string;
  recipientId: string;
  body: string;
  timestamp?: string | number | Date;
  read?: boolean;
  senderName?: string;
  profileImageUrl?: string;
};

export function MessageItem(props: { message: MessageType; currentUserId: string }) {
  const isOutgoing = props.message.senderId === props.currentUserId;
  // Avatar: use profileImageUrl or fallback to initials
  const avatar = props.message.profileImageUrl ? (
    <img
      src={props.message.profileImageUrl}
      alt={props.message.senderName || 'User'}
      className="w-8 h-8 rounded-full object-cover"
    />
  ) : (
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-400 text-white flex items-center justify-center text-sm font-bold">
      {props.message.senderName?.[0]?.toUpperCase() || '?'}
    </div>
  );
  return (
    <div className={`flex items-end space-x-2 ${isOutgoing ? 'flex-row-reverse space-x-reverse' : ''}`}>
      {avatar}
      <div
        role="article"
        aria-label={isOutgoing ? 'Outgoing message' : 'Incoming message'}
        className={`max-w-xs p-3 rounded-md ${isOutgoing ? 'bg-blue-100 self-end text-right' : 'bg-gray-200 self-start text-left'}`}
      >
        <p className="text-sm font-semibold">
          {isOutgoing ? `To: ${props.message.recipientId}` : `From: ${props.message.senderName || props.message.senderId}`}
        </p>
        <p>{props.message.body}</p>
        <p className="text-xs text-gray-500 mt-1">
          {props.message.timestamp
            ? formatDistanceToNow(new Date(props.message.timestamp), { addSuffix: true })
            : ''}
          {isOutgoing && props.message.read && (
            <span className="ml-2 text-green-500">✓✓</span>
          )}
        </p>
      </div>
    </div>
  );
}
export function MessageList({ recipientId, senderId }: { recipientId: string; senderId: string | undefined }) {
  const { messages, isLoading } = useMessages();
  const [enrichedMessages, setEnrichedMessages] = useState<MessageType[]>([]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!messages || messages.length === 0) {
    return <p>No messages available.</p>;
  }

  const filteredMessages = messages.filter(
    msg => (msg.recipientId === recipientId && msg.senderId === senderId) ||
           (msg.recipientId === senderId && msg.senderId === recipientId)
  );

  useEffect(() => {
    async function enrichMessages() {
      const senders = Array.from(new Set(filteredMessages.map(m => m.senderId)));
      type Profile = {
        id: string;
        full_name: string;
        avatar_url: string;
      };

      const profilesRes = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', senders) as { data: Profile[] | null };

      if (profilesRes.data) {
        const profileMap = new Map(profilesRes.data.map(p => [p.id, p]));
        const enriched = filteredMessages.map(m => ({
          ...m,
          senderId: String(m.senderId),
          recipientId: String(m.recipientId),
          body: String(m.body),
          senderName: profileMap.get(String(m.senderId))?.full_name || undefined,
          profileImageUrl: profileMap.get(String(m.senderId))?.avatar_url || undefined,
          timestamp: m.timestamp instanceof Date || typeof m.timestamp === 'string' || typeof m.timestamp === 'number' ? m.timestamp : undefined,
          read: typeof m.read === 'boolean' ? m.read : undefined,
        }));
        setEnrichedMessages(enriched);
      }
    }

    enrichMessages();
  }, [filteredMessages]);

  if (filteredMessages.length === 0) {
    return <p>No messages available.</p>;
  }

  return (
    <div className="flex flex-col space-y-4">
      {(enrichedMessages.length > 0 ? enrichedMessages : filteredMessages).map((message) => (
        <MessageItem
          key={message.id}
          message={{
            id: message.id,
            senderId: String(message.senderId ?? ''),
            recipientId: String(message.recipientId ?? ''),
            body: String(message.body || ''),
            timestamp: typeof message.timestamp === 'object' && !(message.timestamp instanceof Date)
              ? undefined
              : message.timestamp,
            read: typeof message.read === 'boolean' ? message.read : undefined,
            senderName: typeof message.senderName === 'string' ? message.senderName : undefined,
            profileImageUrl: typeof message.profileImageUrl === 'string' ? message.profileImageUrl : undefined,
          }}
          currentUserId={senderId || ''}
        />
      ))}
    </div>
  );
}
export default MessageList;