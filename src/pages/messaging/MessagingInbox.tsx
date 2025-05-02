import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

interface ThreadPreview {
  sender_id: string;
  last_message: string;
  last_sent_at: string;
}

export default function MessagingInbox() {
  const [threads, setThreads] = useState<ThreadPreview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchThreads = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('sender_id, content, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to load threads:', error);
        return;
      }

      // Group by sender_id and take only the latest message
      const latestBySender = new Map<string, ThreadPreview>();
      data?.forEach((msg) => {
        if (!latestBySender.has(msg.sender_id)) {
          latestBySender.set(msg.sender_id, {
            sender_id: msg.sender_id,
            last_message: msg.content,
            last_sent_at: msg.created_at,
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
              <p className="font-semibold">Client ID: {thread.sender_id}</p>
              <p className="text-sm text-gray-600">{thread.last_message}</p>
              <p className="text-xs text-gray-400 mt-1">
                Sent at: {new Date(thread.last_sent_at).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
