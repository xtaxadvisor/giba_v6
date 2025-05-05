import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase/client';
import { MessagingCenter } from '../messaging/MessagingCenter';

export function Messages() {
  const { user } = useAuth();
  const [recipientId, setRecipientId] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipient = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('assigned_professional_id')
        .eq('id', user?.id)
        .maybeSingle();

      if (!error && data?.assigned_professional_id) {
        setRecipientId(data.assigned_professional_id);
      }
    };

    if (user?.id) fetchRecipient();
  }, [user?.id]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
      </div>
      {recipientId && <MessagingCenter recipientId={recipientId} />}
    </div>
  );
}
export default Messages;