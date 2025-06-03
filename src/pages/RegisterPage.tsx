import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useNotificationStore } from '@/lib/store';

export function RegisterPage() {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const { addNotification } = useNotificationStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!role) {
      addNotification('Please select a role to continue.', 'error');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: fullName,
            roles: [role], // ✅ assuming Supabase `profiles.roles` is a text[]
          }
        }
      });

      if (error) throw error;

      addNotification('📩 Magic link sent! Check your inbox.', 'success');
    } catch (err) {
      console.error('Signup error:', err);
      addNotification(
        err instanceof Error ? err.message : 'Signup failed. Try again later.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto mt-10">
      <h2 className="text-lg font-semibold">Sign up with Magic Link</h2>

      <input
        type="text"
        placeholder="Full Name (optional)"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        className="w-full px-4 py-2 border rounded"
      />

      <input
        type="email"
        placeholder="you@example.com"
        value={email}
        required
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-2 border rounded"
      />

      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="w-full px-4 py-2 border rounded"
        required
      >
        <option value="">Select Role</option>
        <option value="client">Client</option>
        <option value="professional">Professional</option>
        <option value="admin">Admin</option>
      </select>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Sending...' : 'Send Magic Link'}
      </button>
    </form>
  );
}