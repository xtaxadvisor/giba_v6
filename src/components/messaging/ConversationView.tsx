

import { useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase/client';
import { MessageInput } from '@/components/messaging/MessageInput';

interface Message {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
  assigned_to?: string;
  read?: boolean;
}

export default function ConversationView() {
  const { senderId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('sender_id', senderId)
        .order('created_at', { ascending: true });

      if (data) {
        setMessages(data);
        setLoading(false);
      }

      // Mark messages as read
      await supabase
        .from('messages')
        .update({ read: true })
        .eq('sender_id', senderId)
        .eq('read', false);
    };

    if (senderId) fetchMessages();
  }, [senderId]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const { data: inserted, error } = await supabase
      .from('messages')
      .insert([
        {
          sender_id: 'admin-system',
          recipient_id: senderId,
          content,
          created_at: new Date().toISOString(),
          read: false,
        },
      ])
      .select();

    if (inserted) {
      setMessages((prev) => [...prev, inserted[0]]);
      setNewMessage('');
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Conversation</h1>
      {loading ? (
        <p>Loading messages...</p>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className="border rounded p-3">
              <p className="text-xs text-gray-500 mb-1">
                {msg.sender_id === 'admin-system' ? 'You' : 'Client'} · {new Date(msg.created_at).toLocaleString()}
              </p>
              <p className="text-sm text-gray-800">{msg.content}</p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}

      <div className="mt-6">
        <MessageInput
          value={newMessage}
          onChange={setNewMessage}
          onSendMessage={handleSendMessage}
          user={{ id: 'admin-system', role: 'admin', name: 'Support Staff' }}
        />
      </div>
    </div>
  );
}