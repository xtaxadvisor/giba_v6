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
import { supabase } from '../../lib/supabase/client';

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
  const [error, setError] = useState<string | null>(null);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [assignedToMeOnly, setAssignedToMeOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const currentUserEmail = 'admin@protaxadvisors.tax'; // Replace with actual auth context later

  const navigate = useNavigate();
  const handleViewConversation = (senderId: string) => {
    navigate(`/messaging/${senderId}`);
  };

  // Reset pagination and threads when filters change
  useEffect(() => {
    setThreads([]);
    setPage(1);
    setHasMore(true);
  }, [showUnreadOnly, assignedToMeOnly]);

  useEffect(() => {
    const fetchThreads = async () => {
      setLoading(true);
      setError(null);
      const pageSize = 10;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      // Build base query
      let query = supabase
        .from('messages')
        .select('sender_id, content, created_at, read, assigned_to, profiles(full_name)', { count: 'exact' });

      // We fetch all messages for filtering and grouping client-side,
      // because filtering by unread or assigned_to on grouped messages is complex in Supabase.
      // Pagination is applied after grouping.

      const { data, error: fetchError, count } = await query;

      if (fetchError) {
        setError('Failed to load messages. Please try again later.');
        setLoading(false);
        return;
      }

      if (!data) {
        setError('No messages found.');
        setLoading(false);
        return;
      }

      const typedData = data as SupabaseMessage[];

      // Filter messages client-side based on filters
      let filteredData = typedData;
      if (showUnreadOnly) {
        filteredData = filteredData.filter((m) => !m.read);
      }
      if (assignedToMeOnly) {
        filteredData = filteredData.filter((m) => m.assigned_to === currentUserEmail);
      }

      // Group by sender_id and get latest message per sender
      const latestBySender = new Map<string, ThreadPreview>();

      filteredData.forEach((msg) => {
        const existing = latestBySender.get(msg.sender_id);
        if (!existing || new Date(msg.created_at) > new Date(existing.last_sent_at)) {
          const senderName = msg.profiles?.[0]?.full_name ?? msg.sender_id;
          // Calculate unread messages for this sender in filteredData
          const unreadMessages = filteredData.filter(
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

      // Convert map to array and sort by last_sent_at descending
      const sortedThreads = Array.from(latestBySender.values()).sort(
        (a, b) => new Date(b.last_sent_at).getTime() - new Date(a.last_sent_at).getTime()
      );

      // Apply pagination client-side
      const paginatedThreads = sortedThreads.slice(from, to + 1);

      // Merge new threads with existing, deduplicating by sender_id
      setThreads((prev) => {
        const existingIds = new Set(prev.map((t) => t.sender_id));
        const newThreads = paginatedThreads.filter((t) => !existingIds.has(t.sender_id));
        return page === 1 ? paginatedThreads : [...prev, ...newThreads];
      });

      // Determine if more pages available
      setHasMore(to + 1 < sortedThreads.length);
      setLoading(false);
    };

    fetchThreads();
  }, [page, showUnreadOnly, assignedToMeOnly]);

  // Filtering logic for display (additional safeguard)
  const visibleThreads = threads.filter((t) => {
    if (showUnreadOnly && t.unread_count === 0) return false;
    if (assignedToMeOnly && t.assigned_to !== currentUserEmail) return false;
    return true;
  });

  return (
    <>
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Client Messages</h1>
        <div className="mb-4 text-right">
          <button
            onClick={() => setShowUnreadOnly((prev) => !prev)}
            className="text-sm text-blue-600 hover:underline"
            aria-pressed={showUnreadOnly}
          >
            {showUnreadOnly ? 'Show All Messages' : 'Show Unread Only'}
          </button>
          <button
            onClick={() => setAssignedToMeOnly((prev) => !prev)}
            className="ml-4 text-sm text-blue-600 hover:underline"
            aria-pressed={assignedToMeOnly}
          >
            {assignedToMeOnly ? 'Show All' : 'Only My Messages'}
          </button>
        </div>
        {error ? (
          <p className="text-red-600 font-semibold">{error}</p>
        ) : loading && threads.length === 0 ? (
          <p>Loading threads...</p>
        ) : visibleThreads.length === 0 ? (
          <p>No messages found.</p>
        ) : (
          <ul className="space-y-4">
            {visibleThreads.map((thread) => (
              <li
                key={thread.sender_id}
                className="border border-gray-300 rounded p-4 shadow-sm hover:bg-gray-50 transition"
              >
                <p className="font-semibold flex items-center">
                  {thread.sender_name}
                  {thread.unread_count > 0 && (
                    <span className="ml-2 inline-block bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {thread.unread_count}
                    </span>
                  )}
                </p>
                <p className="text-sm text-gray-600">{thread.last_message}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Sent at: {new Date(thread.last_sent_at).toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">Assigned to: {thread.assigned_to || 'Unassigned'}</p>
                <select
                  onChange={async (e) => {
                    const newAssignee = e.target.value || null;
                    await supabase
                      .from('messages')
                      .update({ assigned_to: newAssignee })
                      .eq('sender_id', thread.sender_id);
                    setThreads((prev) =>
                      prev.map((t) =>
                        t.sender_id === thread.sender_id
                          ? { ...t, assigned_to: newAssignee || undefined }
                          : t
                      )
                    );
                  }}
                  value={thread.assigned_to || ''}
                  className="mt-1 text-xs text-gray-700 border rounded px-2 py-1"
                >
                  <option value="">Unassigned</option>
                  <option value="admin@protaxadvisors.tax">Admin</option>
                  <option value="staff@protaxadvisors.tax">Staff</option>
                </select>
                <div className="mt-2 flex items-center">
                  <button
                    onClick={() => handleViewConversation(thread.sender_id)}
                    className="text-blue-600 hover:underline text-sm"
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
                </div>
              </li>
            ))}
          </ul>
        )}
        {!loading && hasMore && !error && (
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
    </>
  );
};
