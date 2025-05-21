import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

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
        setMessages((data || []).filter((m) => !m.archived));
      }
      setLoading(false);
    };

    fetchMessages();
  }, []);

  return (
    <div className="p-6">
      <header className="mb-6 border-b pb-4">
        <h1 className="text-3xl font-bold">Inbox</h1>
      </header>
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
                <button onClick={() => navigate(`/messaging/${msg.sender_id}`)} className="text-sm text-indigo-600 underline">
                  Reply
                </button>
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