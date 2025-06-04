import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useNotificationStore } from '@/lib/store';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { addNotification } = useNotificationStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!roles.length) {
      addNotification('⚠️ Please select at least one role.', 'error');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: fullName,
            roles
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

  const toggleRole = (role: string) => {
    setRoles(prev =>
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-xl font-semibold text-center text-gray-800">Register with Magic Link</h2>

      <input
        type="text"
        placeholder="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        className="w-full px-4 py-2 border rounded shadow-sm"
        required
      />

      <input
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-2 border rounded shadow-sm"
        required
      />

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-gray-700 mb-1">Choose your roles:</legend>
        {['client', 'professional', 'investor'].map((role) => (
          <label key={role} className="flex items-center gap-2">
            <input
              type="checkbox"
              onChange={() => toggleRole(role)}
              checked={roles.includes(role)}
            />
            <span className="capitalize">{role}</span>
          </label>
        ))}
      </fieldset>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? 'Sending...' : 'Send Magic Link'}
      </button>
    </form>
  );
}