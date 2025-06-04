// ✅ src/pages/RegisterPage.tsx (Multi-Role, Auto-Profile, CAPTCHA-ready)
import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useNotificationStore } from '@/lib/store';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { addNotification } = useNotificationStore();

  const allowedDomains = ['protaxadvisors.tax'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const domain = email.split('@')[1];
    if (!allowedDomains.includes(domain)) {
      addNotification('Unauthorized email domain.', 'error');
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
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto mt-10">
      <h2 className="text-lg font-semibold text-center">Register with Magic Link</h2>

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
        placeholder="you@protaxadvisors.tax"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-2 border rounded shadow-sm"
        required
      />

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Choose your roles:</legend>
        <label className="flex items-center gap-2">
          <input type="checkbox" onChange={() => toggleRole('client')} /> Client
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" onChange={() => toggleRole('professional')} /> Professional
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" onChange={() => toggleRole('investor')} /> Investor
        </label>
      </fieldset>

      {/* You can wire in hCaptcha or Google reCAPTCHA here */}

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