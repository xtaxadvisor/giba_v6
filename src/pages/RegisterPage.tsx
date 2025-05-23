// components/forms/RegisterForm.tsx
import { Mail, Lock, User, Building } from 'lucide-react';
import { Input } from '../components/ui/Input';
// import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';

interface RegisterFormProps {
  formData: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: string;
    date: string;
    phone: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: string;
    date: string;
    phone: string;
  }>>;
  loading: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

const RegisterForm = ({ formData, setFormData, loading, handleSubmit }: RegisterFormProps) => {
  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="rounded-md shadow-sm -space-y-px">
        <Input
          id="name"
          type="text"
          label="Full Name"
          icon={User}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          placeholder="John Doe"
        />
        <Input
          id="email"
          type="email"
          label="Email address"
          icon={Mail}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          placeholder="you@example.com"
        />
        <Input
          id="password"
          type="password"
          label="Password"
          icon={Lock}
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
          placeholder="Password"
        />
        <Input
          id="confirmPassword"
          type="password"
          label="Confirm Password"
          icon={Lock}
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          required
          placeholder="Confirm Password"
        />
        <Select
          label="Account Type"
          options={[
            { value: 'client', label: 'Client' },
            { value: 'professional', label: 'Professional' },
            { value: 'investor', label: 'Investor' }
          ]}
          value={formData.role}
          onChange={(value) => setFormData({ ...formData, role: value })}
          required
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        className="w-full"
        icon={Building}
        disabled={loading}
      >
        {loading ? 'Creating Account...' : 'Create Account'}
      </Button>
    </form>
  );
};

export { RegisterForm };


// src/pages/RegisterPage.tsx
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useNotificationStore } from '../lib/store';
import { supabase } from '../lib/supabase/client';
import RegisterFormComponent from '../components/forms/RegisterForm';

// Removed duplicate RegisterPage function


function RegisterPage() { // eslint-disable-line no-unused-vars 
  const navigate = useNavigate(); // Ensure navigate is defined
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
      const {
        data,
        error
      } = await signUp({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            role: formData.role
          }
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
        <meta name="description" content="Create your ProTaxAdvisors account and access tailored tax and financial services." />
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