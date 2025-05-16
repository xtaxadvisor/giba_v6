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

        if (error) {
          console.error('Failed to fetch user profile:', error.message);
        }

        if (!error && profile) {
          if (profile.role === 'client' && profile.assigned_professional_id) {
            setRecipientId(profile.assigned_professional_id);
          } else if (profile.role === 'professional') {
            // Example placeholder: use first client ID in future logic
            const { data: clients, error: clientsError } = await supabase
              .from('profiles')
              .select('id')
              .eq('assigned_professional_id', session.user.id);

            if (clientsError) {
              console.error('Failed to fetch assigned clients:', clientsError.message);
            } else if (clients && clients.length > 0) {
              // Set the first client ID for now
              setRecipientId(clients[0].id);
            } else {
              console.log('No assigned clients found.');
            }
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
          {recipientId !== null ? (
            <MessagingCenter recipientId={recipientId} />
          ) : (
            <div className="p-6 text-gray-500 text-center">Loading conversation...</div>
          )}
        </div>
      </div>
    </div>
  );
}