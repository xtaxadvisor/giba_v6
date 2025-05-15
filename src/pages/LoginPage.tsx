import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase/client';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useNotificationStore } from '../lib/store';
import { useAuth } from '@/contexts/AuthContext';
import { validatePassword } from '@/utils/validation';

export default function SignInForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addNotification } = useNotificationStore();
  const [searchParams] = useSearchParams();
  const confirmationToken = searchParams.get('confirmation_token');
  const confirmationResent = searchParams.get('confirmation') === 'resent';
  const { setUser } = useAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState('student');
  const [location, setLocation] = useState('');
  const [showResend, setShowResend] = useState(false);

  // ✅ Rehydrate session from Supabase
  useEffect(() => {
    const restoreSession = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data?.session;

      if (session?.user?.id) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('role, full_name, location, phone')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profileData) {
          const customUser = {
            id: session.user.id,
            email: session.user.email ?? '',
            fullName: profileData.full_name ?? '',
            createdAt: session.user.created_at,
            location: profileData.location ?? '',
            role: profileData.role ?? '',
            phone: profileData.phone ?? '',
            userType: profileData.role ?? '',
          };

          setUser(customUser);
          localStorage.setItem('currentUser', JSON.stringify(customUser));
        }
      }
    };

    restoreSession();
  }, []);

  // ✅ Handle Supabase session expiration or logout
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || (event === 'TOKEN_REFRESHED' && !session)) {
        console.log('Session expired. Logging out...');
        supabase.auth.signOut();
        localStorage.removeItem('currentUser');
        localStorage.removeItem('accessToken');
        navigate('/login');
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe?.();
    };
  }, []);

  const handleResendConfirmation = async () => {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: 'https://protaxadvisors.tax/login?confirmed=true'
      }
    });
    if (error) {
      setError('Failed to resend confirmation email. Please try again later.');
    } else {
      addNotification('Confirmation email resent.', 'success');
      setShowResend(false);
      navigate('/login?confirmation=resent');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setShowResend(false);

    try {
      if (isSignUp) {
        const { isValid, errors } = validatePassword(password);
        if (!isValid) {
          setError(errors[0]);
          setLoading(false);
          return;
        }

        if (password !== confirmPassword) {
          setError('Passwords do not match.');
          setLoading(false);
          return;
        }

        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: 'https://protaxadvisors.tax/login?confirmed=true'
          }
        });

        if (signUpError) {
          if (signUpError.status === 429 || signUpError.message?.includes('over_email_send_rate_limit')) {
            setError('Please wait a minute before trying again.');
            setLoading(false);
            return;
          }
          throw signUpError;
        }
        if (
          signUpData?.user &&
          (!Array.isArray(signUpData.user.identities) ||
           signUpData.user.identities.length === 0)
        ) {
          alert("This email is already registered. Please log in instead.");
          setLoading(false);
          return;
        }

        if (!signUpData?.user) throw new Error('Signup failed: user is null');

        addNotification('Signup successful! Please check your email.', 'success');
        navigate('/login');
        return;
      }

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (signInError) {
        if (signInError.message.toLowerCase().includes('email not confirmed')) {
          setError('Email not confirmed. Please check your inbox or click below to resend confirmation.');
          setShowResend(true);
          setLoading(false);
          return;
        }
        setError('Invalid email or password.');
        setLoading(false);
        return;
      }

      localStorage.setItem('accessToken', data.session?.access_token || '');

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, full_name, location, phone')
        .eq('id', data.user.id)
        .maybeSingle();

      if (profileError) {
        setError('Profile not found. Please contact support.');
        return;
      }

      if (!profile) {
        // Insert profile if not found
        try {
          const { error: insertError } = await supabase.from('profiles').insert({
            id: data.user.id,
            full_name: name,
            role: selectedRole,
            location
          });
          if (insertError) {
            console.error('Profile insert failed:', insertError.message);
            addNotification('Could not save your profile. Please contact support.', 'error');
          }
        } catch (insertErr) {
          console.error('Unexpected error inserting profile:', insertErr);
          addNotification('An unexpected error occurred while saving your profile.', 'error');
        }
      }

      const customUser = {
        id: data.user.id,
        email: data.user.email || '',
        fullName: profile?.full_name || '',
        createdAt: data.user.created_at ?? '',
        location: profile?.location || '',
        role: profile?.role ?? '',
        phone: profile?.phone || '',
        userType: profile?.role ?? ''
      };

      setUser(customUser);
      localStorage.setItem('currentUser', JSON.stringify(customUser));

      // Check for portal redirect after login
      const portalRedirect = sessionStorage.getItem('fromPortal');
      if (portalRedirect) {
        sessionStorage.removeItem('fromPortal');
        navigate(portalRedirect);
        return;
      }

      // Optional: log login event
      try {
        await supabase.from('login_logs').insert({
          user_id: data.user.id,
          email: data.user.email,
          role: profile?.role,
          timestamp: new Date().toISOString(),
          path_accessed: `/${profile?.role}/dashboard`,
        });
      } catch (logErr) {
        console.warn('Login log failed:', logErr);
      }

      addNotification('Welcome back!', 'success');

      switch (profile?.role) {
        case 'professional':
          navigate('/professional/dashboard');
          break;
        case 'student':
          navigate('/student/dashboard');
          break;
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'investor':
          navigate('/investor/dashboard');
          break;
        case 'client':
          navigate('/client/dashboard');
          break;
        case 'superadmin':
          navigate('/superadmin/dashboard');
          return;
        default:
          if (customUser.email === 'giba1970@hotmail.com') {
            navigate('/admin/dashboard');
            return;
          }
          navigate('/select-role');
      }
    } catch (err) {
      setError((err as Error).message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-semibold mb-4">{isSignUp ? 'Sign Up' : 'Sign In'}</h2>

      {confirmationResent && (
        <div className="mb-4 text-blue-600">
          Confirmation email sent. Please check your inbox and then log in.
        </div>
      )}
      {error && <div className="mb-4 text-red-600">{error}</div>}
      {showResend && (
        <div className="mt-2">
          <button
            type="button"
            onClick={handleResendConfirmation}
            className="text-sm text-blue-600 hover:underline"
          >
            Resend confirmation email
          </button>
        </div>
      )}
      {confirmationToken && (
        <div className="mb-4 text-green-600">
          Thanks for confirming your email. You can now log in.
        </div>
      )}

      {isSignUp && (
        <>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium mb-1">Full Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="w-full border-gray-300 rounded p-2"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="role" className="block text-sm font-medium mb-1">Role</label>
            <select
              id="role"
              value={selectedRole}
              onChange={e => setSelectedRole(e.target.value)}
              className="w-full border-gray-300 rounded p-2"
              required
            >
              <option value="student">Student</option>
              <option value="investor">Investor</option>
              <option value="professional">Professional</option>
              <option value="client">Client</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="location" className="block text-sm font-medium mb-1">Location</label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              required
              className="w-full border-gray-300 rounded p-2"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
              className="w-full border-gray-300 rounded p-2"
            />
          </div>
        </>
      )}

      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          autoComplete="username"
          className="w-full border-gray-300 rounded p-2"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          autoComplete={isSignUp ? 'new-password' : 'current-password'}
          className="w-full border-gray-300 rounded p-2"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        {loading ? (isSignUp ? 'Signing up...' : 'Signing in...') : (isSignUp ? 'Sign Up' : 'Sign In')}
      </button>

      <button
        type="button"
        className="mt-4 text-sm text-blue-600 hover:underline"
        onClick={() => setIsSignUp(prev => !prev)}
      >
        {isSignUp ? 'Already have an account? Sign In' : 'Don’t have an account? Sign Up'}
      </button>
    </form>
  );
}