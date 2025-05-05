import { useEffect, useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/lib/supabase/client';
import { MessagingCenter } from '../../components/messaging/MessagingCenter';

export default function MessagingPortal() {
  const session = useSession();
  const [recipientId, setRecipientId] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipient = async () => {
      if (session?.user?.id) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('assigned_professional_id, role')
          .eq('id', session.user.id)
          .maybeSingle();

        if (!error && profile) {
          if (profile.role === 'client' && profile.assigned_professional_id) {
            setRecipientId(profile.assigned_professional_id);
          } else if (profile.role === 'professional') {
            // Future logic: fetch clients or show inbox overview
            setRecipientId(null); // Placeholder or default behavior
          }
        }
      }
    };

    fetchRecipient();
  }, [session?.user?.id]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {recipientId && <MessagingCenter recipientId={recipientId} />}
        </div>
      </div>
    </div>
  );
}