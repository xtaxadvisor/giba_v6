import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase/client';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export default function LoginPage() {
  const navigate = useNavigate();
  const { hydrated } = useAuth();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = useCallback(async () => {
    setLoading(true);
    setError(null);
    const email = emailRef.current?.value || '';
    const password = passwordRef.current?.value || '';

    if (!email || !password) {
      setError('Please enter both email and password.');
      setLoading(false);
      return;
    }

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      // Fetch user role from your database or user metadata
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profileError || !profileData) {
        setError('Failed to fetch user role.');
        setLoading(false);
        return;
      }

      const role = profileData.role;

      switch (role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'client':
          navigate('/client');
          break;
        case 'professional':
          navigate('/professional');
          break;
        case 'investor':
          navigate('/investor');
          break;
        case 'student':
          navigate('/student');
          break;
        case 'guest':
          navigate('/guest');
          break;
        default:
          navigate('/dashboard');
          break;
      }
    }
    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    if (emailRef.current) {
      emailRef.current.focus();
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>Login | ProTaxAdvisors</title>
        <meta name="description" content="Secure login to your ProTaxAdvisors account." />
        <meta property="og:title" content="Let your Taxes Obligations work for You!!" />
        <meta property="og:description" content="Our tax expertise benefits your business growth!" />
        <meta property="og:image" content="https://www.protaxadvisors.tax/assets/og-preview.jpg" />
        <meta property="og:url" content="https://www.protaxadvisors.tax/login" />
        <meta property="og:type" content="website" />
      </Helmet>
      {!hydrated ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <LoadingSpinner />
            <p className="mt-4 text-gray-600 text-sm">Initializing session... Please wait.</p>
          </div>
        </div>
      ) : (
        <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
          <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
          {error && (
            <div className="mb-4 text-red-600" role="alert" aria-live="assertive">
              {error}
            </div>
          )}
          <div className="mb-4">
            <label htmlFor="email" className="block mb-1 font-semibold">
              Email
            </label>
            <input
              ref={emailRef}
              id="email"
              type="email"
              className="w-full border px-3 py-2 rounded"
              placeholder="you@example.com"
              autoComplete="username"
              disabled={loading}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block mb-1 font-semibold">
              Password
            </label>
            <input
              ref={passwordRef}
              id="password"
              type="password"
              className="w-full border px-3 py-2 rounded"
              placeholder="Your password"
              autoComplete="current-password"
              disabled={loading}
            />
          </div>
          <div className="mt-4 text-right">
            <a href="/forgot-password" className="text-sm text-blue-600 hover:underline">
              Forgot your password?
            </a>
          </div>
          <button
            type="button"
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <div className="mt-6 flex flex-col gap-2">
            <hr className="my-4" />
            <button
              type="button"
              onClick={() =>
                supabase.auth.signInWithOAuth({
                  provider: 'google',
                  options: {
                    redirectTo: window.location.origin + '/dashboard'
                  }
                })
              }
              className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
            >
              Continue with Google
            </button>
            <button
              type="button"
              onClick={() =>
                supabase.auth.signInWithOAuth({
                  provider: 'github',
                  options: {
                    redirectTo: window.location.origin + '/dashboard'
                  }
                })
              }
              className="w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-900"
            >
              Continue with GitHub
            </button>
            <button
              type="button"
              onClick={() =>
                supabase.auth.signInWithOAuth({
                  provider: 'apple',
                  options: {
                    redirectTo: window.location.origin + '/dashboard'
                  }
                })
              }
              className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
            >
              Continue with Apple
            </button>
          </div>
          <div className="mt-4 text-center">
            <a href="/register" className="text-blue-600 hover:underline">
              Sign up here
            </a>
          </div>
       </div>
      )}
    </>
  );
}