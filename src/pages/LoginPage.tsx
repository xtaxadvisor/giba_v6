import { withRoleGuard } from '../lib/auth/withRoleGuard';
import { useState } from 'react';
import { supabase } from '../lib/supabase/client';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useNotificationStore } from '../lib/store';
import { useAuth } from '../contexts/AuthContext';

export default function SignInForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addNotification } = useNotificationStore();
  const [searchParams] = useSearchParams();
  const confirmationToken = searchParams.get('confirmation_token');
  const { setUser } = useAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState('student');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null); 
    try {
      if (isSignUp) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: 'https://protaxadvisors.tax/login?confirmed=true'
          }
        });
        if (signUpError) throw signUpError;
        if (!data.user) throw new Error('Signup failed: user is null');

        await supabase.from('profiles').insert({
          id: data.user.id,
          full_name: name,
          role: selectedRole,
        });

        addNotification('Signup successful! Please check your email.', 'success');
        return;
      }

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      if (signInError) {
        console.error('SignIn error:', signInError);
        if (signInError.message === 'Invalid login credentials') {
          setError('Invalid email or password. Please try again.');
        } else {
          setError(signInError.message || 'An error occurred during login.');
        }
      } else {
        console.log('SignIn success, session:', data.session);
        // Fetch the user's profile to determine their role
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role, name, location') // Include 'name' and 'location' in the query
          .eq('id', data.user.id)
          .maybeSingle();

        if (profileError || !profile) {
          console.error('Profile fetch error or missing profile:', profileError, profile);
          setError('Profile not found. Please contact support.');
          return;
        }

        setUser({
          ...data.user,
          name: profile?.name || '', // Safely access 'name' from profile
          email: data.user.email ?? '', // Always provide a string for email
          createdAt: data.user.created_at ?? '', // Map `created_at` to `createdAt`
          location: profile?.location || '', // Safely access 'location' from profile
          role: profile.role ?? ''
        });
        // Optionally handle profile data here if needed

        addNotification('Welcome back!', 'success');
        switch (profile.role) {
          case 'professional':
            navigate('/professional/dashboard');
            break;
          case 'student':
            navigate('/student/dashboard');
            break;
          case 'admin':
            navigate('/admin/dashboard');
            break;
          default:
            navigate('/client/dashboard');
        }
      }
    } catch (err) {
      console.error('Unexpected error during signIn:', err);
      setError((err as Error).message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-semibold mb-4">{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
      {error && <div className="mb-4 text-red-600">{error}</div>}
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
        </>
      )}
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          autoComplete="email"
          className="w-full border-gray-300 rounded p-2"
        />
      </div>
      <div className="mb-6">
        <label htmlFor="password" className="block text-sm font-medium mb-1">
          Password
        </label>
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