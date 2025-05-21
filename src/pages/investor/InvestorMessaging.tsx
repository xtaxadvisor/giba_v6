

import React, { useEffect, useState } from 'react';
import { MessagingCenter } from '@/components/messaging/MessagingCenter';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase/client';
import { Link } from 'react-router-dom';

const InvestorMessaging = () => {
  const { user } = useAuth();
  const [recipientId, setRecipientId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignedAdvisor = async () => {
      if (!user?.id) return;

      const { data } = await supabase
        .from('profiles')
        .select('assigned_to')
        .eq('id', user.id)
        .maybeSingle();

      if (data?.assigned_to) setRecipientId(data.assigned_to);
      setLoading(false);
    };

    fetchAssignedAdvisor();
  }, [user]);

  return (
    <>
      <div className="p-4">
        <Link
          to="/investor"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          ← Back to Dashboard
        </Link>
      </div>
      {loading ? (
        <div className="p-4">Loading messaging center...</div>
      ) : !recipientId ? (
        <div className="p-4 text-red-600">No assigned advisor found. Please contact support.</div>
      ) : (
        <MessagingCenter recipientId={recipientId} />
      )}
    </>
  );
};

export default InvestorMessaging;