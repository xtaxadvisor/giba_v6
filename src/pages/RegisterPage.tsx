// src/pages/RegisterPage.tsx (Enhanced: role-based redirect, secure metadata)
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useNotificationStore } from '../lib/store';
import { supabase } from '../lib/supabase/client';
import RegisterFormComponent from '../components/forms/RegisterForm';

function RegisterPage() {
  const navigate = useNavigate();
  const { addNotification } = useNotificationStore();
  const supabaseContext = supabase;
  if (!supabaseContext || !supabaseContext.auth || !supabaseContext.auth.signUp) {
    throw new Error('Supabase context is not properly initialized.');
  }
  const { signUp } = supabaseContext.auth;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'client',
    date: '',
    phone: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      addNotification('Passwords do not match', 'error');
      return;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;
    if (!passwordRegex.test(formData.password)) {
      addNotification(
        'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character.',
        'error'
      );
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await signUp({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            roles: [formData.role], // multi-role support
            primary_role: formData.role // optional: for clarity
          },
          emailRedirectTo: `${window.location.origin}/login`
        }
      });

      if (error) {
        throw error;
      }

      addNotification('Registration successful! Please check your email to verify your account.', 'success');
      navigate('/login');
    } catch (error) {
      console.error('Signup error:', error);
      addNotification(
        error instanceof Error ? error.message : 'Registration failed. Please try again.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Register | ProTaxAdvisors</title>
        <meta
          name="description"
          content="Create your ProTaxAdvisors account and access tailored tax and financial services."
        />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <Button
              variant="ghost"
              className="mb-4"
              onClick={() => navigate('/')}
              icon={ArrowLeft}
            >
              Back to Home
            </Button>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Create your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Or{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                sign in to your existing account
              </Link>
            </p>
          </div>
          {formData && (
            <RegisterFormComponent
              formData={formData}
              setFormData={setFormData}
              loading={loading}
              handleSubmit={handleSubmit}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default RegisterPage;