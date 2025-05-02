import { useEffect, useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/lib/supabase/client';
import { MessagingCenter } from '../../components/messaging/MessagingCenter';

export default function MessagingPortal() {
  const session = useSession();
  const [recipientId, setRecipientId] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssignedProfessional = async () => {
      if (session?.user?.id) {
        const { data, error } = await supabase
          .from('profiles')
          .select('assigned_professional_id')
          .eq('id', session.user.id)
          .maybeSingle();

        if (!error && data?.assigned_professional_id) {
          setRecipientId(data.assigned_professional_id);
        }
      }
    };

    fetchAssignedProfessional();
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