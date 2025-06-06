import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useNotificationStore } from '@/lib/store';
import ReCAPTCHA from 'react-google-recaptcha';

// Extend the Window interface to include grecaptcha
declare global {
  interface Window {
    grecaptcha?: {
      reset: () => void;
      [key: string]: any;
    };
  }
}

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
console.log('🧪 Loaded RECAPTCHA_SITE_KEY:', RECAPTCHA_SITE_KEY);

if (!RECAPTCHA_SITE_KEY) {
  console.warn('⚠️ Environment variable missing: NEXT_PUBLIC_RECAPTCHA_SITE_KEY');
}


const roleDescriptions: Record<string, string> = {
  client: 'Clients receive tax help and manage their finances.',
  professional: 'Tax professionals who work with clients.',
  investor: 'Investors accessing financial data and updates.',
  student: 'Students using our resources and trainings.',
};

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);
  const { addNotification } = useNotificationStore();

  // ✅ Auto-select role from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlRole = params.get('role');
    if (urlRole && ['client', 'professional', 'investor', 'student'].includes(urlRole)) {
      setRoles([urlRole]);
    }
  }, []);

  // ✅ Save role and full name to Supabase profile
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const { error } = await supabase
          .from('profiles')
          .upsert({
            id: session.user.id,
            full_name: fullName,
            roles,
            remember_me: rememberMe,
          });

        if (error) {
          console.error('Error saving to profiles:', error.message);
        } else {
          console.log('✅ Profile info saved');
        }
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [fullName, roles, rememberMe]);

  const toggleRole = (role: string) => {
    setRoles(prev =>
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    console.log('Submitting registration with:', { email, fullName, roles, rememberMe, recaptchaToken });

    if (!email) {
      console.warn('Email is missing');
      addNotification('⚠️ Please enter your email address.', 'error');
      setLoading(false);
      return;
    }

    if (!roles.length) {
      console.warn('No roles selected');
      addNotification('⚠️ Please select at least one role.', 'error');
      setLoading(false);
      return;
    }

    if (!recaptchaToken) {
      console.warn('reCAPTCHA token missing');
      addNotification('⚠️ Please verify you are not a robot.', 'error');
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
            roles,
            remember_me: rememberMe
          }
        }
      });

      if (error) {
        console.error('Signup error:', error);
        addNotification(error.message || 'Signup failed. Try again later.', 'error');
        setLoading(false);
        return;
      }

      addNotification('📩 Magic link sent! Check your inbox.', 'success');

      const destination = roles.includes('admin')
        ? '/superadmin/dashboard'
        : roles.includes('client')
        ? '/client/dashboard'
        : roles.includes('professional')
        ? '/professional/dashboard'
        : roles.includes('investor')
        ? '/investor/dashboard'
        : roles.includes('student')
        ? '/student/dashboard'
        : '/';

      setTimeout(() => {
        window.location.href = destination;
      }, 500);

      // Reset form and recaptcha token on success
      setEmail('');
      setFullName('');
      setRoles([]);
      setRememberMe(false);
      setRecaptchaToken(null);
      if (typeof window !== 'undefined' && window.grecaptcha && RECAPTCHA_SITE_KEY) {
        window.grecaptcha.reset();
      }
    } catch (err) {
      console.error('Unexpected signup error:', err);
      addNotification(
        err instanceof Error ? err.message : 'Unexpected error occurred. Please try again later.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 max-w-md mx-auto mt-10 p-6 border rounded shadow bg-white dark:bg-gray-900 dark:text-white"
    >
      <h2 className="text-xl font-semibold text-center">Register with Magic Link</h2>

      <input
        type="text"
        placeholder="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        className="w-full px-4 py-2 border rounded shadow-sm dark:bg-gray-800"
        required
      />

      <input
        type="email"
        placeholder="you@domain.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-2 border rounded shadow-sm dark:bg-gray-800"
        required
      />

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium mb-1">Choose your roles:</legend>
        {['client', 'professional', 'investor', 'student'].map((role) => (
          <label key={role} className="flex items-center gap-2 relative group">
            <input
              type="checkbox"
              onChange={() => toggleRole(role)}
              checked={roles.includes(role)}
            />
            <span className="capitalize">{role}</span>
            <span className="ml-1 text-gray-500 cursor-help group-hover:block hidden absolute left-28 top-0 w-52 z-10 bg-white dark:bg-gray-800 border p-2 rounded shadow text-sm">
              {roleDescriptions[role]}
            </span>
          </label>
        ))}
      </fieldset>

      <label className="flex items-center gap-2 mt-3">
        <input
          type="checkbox"
          checked={rememberMe}
          onChange={() => setRememberMe(prev => !prev)}
        />
        Remember me
      </label>

      <div className="mt-3">
        {RECAPTCHA_SITE_KEY && typeof RECAPTCHA_SITE_KEY === 'string' ? (
          <ReCAPTCHA
            sitekey={RECAPTCHA_SITE_KEY}
            onChange={(token) => {
              console.log('✅ CAPTCHA resolved:', token);
              setRecaptchaToken(token);
            }}
          />
        ) : (
          <>
            {console.warn('⚠️ reCAPTCHA site key is undefined or invalid')}
            <p className="text-red-500 text-sm">
              ⚠️ reCAPTCHA site key missing or invalid. Please fix .env.local and restart the server.
            </p>
          </>
        )}
      </div>

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