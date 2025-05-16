import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

interface Message {
  id: string;
  content: string;
  sender_id?: string;
  recipient_id?: string;
  created_at: string;
  is_read?: boolean;
  archived?: boolean;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const handleMarkAsRead = async (id: string) => {
    await supabase.from('messages').update({ is_read: true }).eq('id', id);
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, is_read: true } : m)));
  };

  const handleArchive = async (id: string) => {
    await supabase.from('messages').update({ archived: true }).eq('id', id);
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching messages:', error.message);
      } else {
        setMessages(data || []);
      }
      setLoading(false);
    };

    fetchMessages();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Inbox</h1>
      {loading ? (
        <p>Loading messages...</p>
      ) : messages.length === 0 ? (
        <p>No messages found.</p>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className="p-4 border rounded shadow-sm bg-white">
              <p className="text-gray-700 whitespace-pre-line">{msg.content}</p>
              <div className="mt-2 flex gap-2">
                {!msg.is_read && (
                  <button onClick={() => handleMarkAsRead(msg.id)} className="text-sm text-blue-600 underline">
                    Mark as Read
                  </button>
                )}
                <button className="text-sm text-indigo-600 underline">Reply</button>
                <button onClick={() => handleArchive(msg.id)} className="text-sm text-red-500 underline">
                  Archive
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Received: {new Date(msg.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}