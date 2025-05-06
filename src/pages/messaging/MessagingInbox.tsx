import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

interface ThreadPreview {
  sender_id: string;
  sender_name: string;
  last_message: string;
  last_sent_at: string;
  unread_count: number;
}

export default function MessagingInbox() {
  const [threads, setThreads] = useState<ThreadPreview[]>([]);
  const [loading, setLoading] = useState(true);

  const handleViewConversation = (senderId: string) => {
    console.log('Navigate to thread with:', senderId);
  };

  useEffect(() => {
    const fetchThreads = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('sender_id, content:content, created_at:last_sent_at, profiles:sender_id (full_name)')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to load threads:', error);
        setLoading(false);
        return;
      }

      if (!data) {
        console.warn('No message data returned from supabase');
        setLoading(false);
        return;
      }

      // Group by sender_id and take only the latest message
      const latestBySender = new Map<string, ThreadPreview>();
      data.forEach((msg) => {
        if (!latestBySender.has(msg.sender_id)) {
          const senderName = msg.profiles?.[0]?.full_name ?? msg.sender_id;
          latestBySender.set(msg.sender_id, {
            sender_id: msg.sender_id,
            sender_name: senderName,
            last_message: msg.content,
            last_sent_at: msg.created_at,
            unread_count: 3, // hardcoded unread count for now
          });
        }
      });

      setThreads(Array.from(latestBySender.values()));
      setLoading(false);
    };

    fetchThreads();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Client Messages</h1>
      {loading ? (
        <p>Loading threads...</p>
      ) : (
        <ul className="space-y-4">
          {threads.map((thread) => (
            <li
              key={thread.sender_id}
              className="border border-gray-300 rounded p-4 shadow-sm hover:bg-gray-50 transition"
            >
              <p className="font-semibold">
                {thread.sender_name}
                <span className="ml-2 inline-block bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {thread.unread_count}
                </span>
              </p>
              <p className="text-sm text-gray-600">{thread.last_message}</p>
              <p className="text-xs text-gray-400 mt-1">
                Sent at: {new Date(thread.last_sent_at).toLocaleString()}
              </p>
              <button
                onClick={() => handleViewConversation(thread.sender_id)}
                className="mt-2 text-blue-600 hover:underline text-sm"
              >
                View Conversation
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
