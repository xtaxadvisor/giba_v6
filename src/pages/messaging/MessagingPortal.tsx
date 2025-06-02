import { useEffect, useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/lib/supabase/client';
import { MessagingCenter } from '../../components/messaging/MessagingCenter';

export default function MessagingPortal() {
  const session = useSession();
  const [recipientId, setRecipientId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipient = async () => {
      if (!session?.user?.id) return;

      try {
        setLoading(true);
        setError(null);

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('assigned_professional_id, role')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profileError) throw profileError;

        if (profile && profile.role === 'client' && profile.assigned_professional_id) {
          setRecipientId(profile.assigned_professional_id);
        } else if (profile && profile.role === 'professional') {
          const { data: clients, error: clientsError } = await supabase
            .from('profiles')
            .select('id')
            .eq('assigned_professional_id', session.user.id);

          if (clientsError) throw clientsError;

          if (clients && clients.length > 0) {
            setRecipientId(clients[0].id); // Set the first client ID
          } else {
            setError('No assigned clients found.');
          }
        } else {
          setError('Messaging is not configured for this role.');
        }
      } catch (err: any) {
        console.error('Error in MessagingPortal:', err.message || err);
        setError('Failed to load messaging configuration.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipient();
  }, [session?.user?.id]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-6 text-gray-500 text-center">Loading conversation...</div>
          ) : error ? (
            <div className="p-6 text-red-500 text-center">{error}</div>
          ) : (
            <MessagingCenter recipientId={recipientId!} />
          )}
        </div>
      </div>
    </div>
  );
}