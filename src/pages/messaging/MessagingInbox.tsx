interface SupabaseMessage {
  sender_id: string;
  content: string;
  created_at: string;
  read: boolean;
  assigned_to?: string;
  profiles?: { full_name: string }[];
}
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase/client';

interface ThreadPreview {
  sender_id: string;
  sender_name: string;
  last_message: string;
  last_sent_at: string;
  unread_count: number;
  assigned_to?: string;
}

export default function MessagingInbox() {
  const [threads, setThreads] = useState<ThreadPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [assignedToMeOnly, setAssignedToMeOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const currentUserEmail = 'admin@protaxadvisors.tax'; // Replace with actual auth context later

  const navigate = useNavigate();
  const handleViewConversation = (senderId: string) => {
    navigate(`/messaging/${senderId}`);
  };

  useEffect(() => {
    const fetchThreads = async () => {
      const pageSize = 10;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, error, count } = await supabase
        .from('messages')
        .select('sender_id, content, created_at, read, assigned_to, profiles(full_name)', { count: 'exact' });

      const typedData = data as SupabaseMessage[];

      console.log("📦 Message read flags:", typedData?.map(m => ({ sender: m.sender_id, read: m.read })));

      if (error) {
        console.error('Failed to load threads:', error);
        setLoading(false);
        return;
      }

      if (!typedData) {
        console.warn('No message data returned from supabase');
        setLoading(false);
        return;
      }

      // Group by sender_id and take only the latest message
      const latestBySender = new Map<string, ThreadPreview>();
      typedData.forEach((msg) => {
        if (!latestBySender.has(msg.sender_id)) {
          const senderName = msg.profiles?.[0]?.full_name ?? msg.sender_id;
          // Calculate unread messages for this sender
          const unreadMessages = typedData.filter(
            (m) => m.sender_id === msg.sender_id && !m.read
          ).length;
          latestBySender.set(msg.sender_id, {
            sender_id: msg.sender_id,
            sender_name: senderName,
            last_message: msg.content,
            last_sent_at: msg.created_at,
            unread_count: unreadMessages,
            assigned_to: msg.assigned_to,
          });
        }
      });

      setThreads((prev) => [...prev, ...Array.from(latestBySender.values())]);
      setHasMore(to + 1 < (count ?? 0));
      setLoading(false);
    };

    fetchThreads();
  }, [page]);

  // Filtering logic for unread/all toggle and assigned to me toggle
  const visibleThreads = threads.filter((t) => {
    if (showUnreadOnly && t.unread_count === 0) return false;
    if (assignedToMeOnly && t.assigned_to !== currentUserEmail) return false;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Client Messages</h1>
      <div className="mb-4 text-right">
        <button
          onClick={() => setShowUnreadOnly(!showUnreadOnly)}
          className="text-sm text-blue-600 hover:underline"
        >
          {showUnreadOnly ? 'Show All Messages' : 'Show Unread Only'}
        </button>
        <button
          onClick={() => setAssignedToMeOnly(!assignedToMeOnly)}
          className="ml-4 text-sm text-blue-600 hover:underline"
        >
          {assignedToMeOnly ? 'Show All' : 'Only My Messages'}
        </button>
      </div>
      {loading ? (
        <p>Loading threads...</p>
      ) : (
        <ul className="space-y-4">
          {visibleThreads.map((thread) => (
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
              <p className="text-xs text-gray-500">Assigned to: {thread.assigned_to || 'Unassigned'}</p>
              <select
                onChange={async (e) => {
                  const newAssignee = e.target.value;
                  await supabase
                    .from('messages')
                    .update({ assigned_to: newAssignee })
                    .eq('sender_id', thread.sender_id);
                  setThreads((prev) =>
                    prev.map((t) =>
                      t.sender_id === thread.sender_id
                        ? { ...t, assigned_to: newAssignee }
                        : t
                    )
                  );
                }}
                defaultValue={thread.assigned_to || ''}
                className="mt-1 text-xs text-gray-700 border rounded px-2 py-1"
              >
                <option value="">Unassigned</option>
                <option value="admin@protaxadvisors.tax">Admin</option>
                <option value="staff@protaxadvisors.tax">Staff</option>
              </select>
              <button
                onClick={() => handleViewConversation(thread.sender_id)}
                className="mt-2 text-blue-600 hover:underline text-sm"
              >
                View Conversation
              </button>
              <button
                onClick={async () => {
                  await supabase
                    .from('messages')
                    .update({ read: true })
                    .eq('sender_id', thread.sender_id)
                    .eq('read', false);

                  setThreads((prev) =>
                    prev.map((t) =>
                      t.sender_id === thread.sender_id
                        ? { ...t, unread_count: 0 }
                        : t
                    )
                  );
                }}
                className="ml-4 text-xs text-gray-500 hover:underline"
              >
                Mark as Read
              </button>
            </li>
          ))}
        </ul>
      )}
      {/* Pagination placeholder */}
      {!loading && hasMore && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="text-blue-600 hover:underline text-sm"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
