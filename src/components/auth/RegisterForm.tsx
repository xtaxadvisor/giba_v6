import React, { useState, useEffect } from 'react';
import { Mail, User } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

import { useParams, useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient('https://asdthnxphqjpxzyhpylr.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzZHRobnhwaHFqcHh6eWhweWxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkwNDg4MDMsImV4cCI6MjA1NDYyNDgwM30.AGjxQM7QkIUA6d0jgJa4uaXQlJX8r9Bya9zC7B7F9qc');
import { useAuth } from '@/contexts/AuthContext'; // ✅
import { validatePassword } from '@/utils/validation';

export function RegisterForm() {
  const authContext = useAuth();
  const user = authContext?.user as { id: string; role?: string; phone?: string } || null;
  const { role: paramRole } = useParams?.() || {};

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    date: '',
    phone: '',
    role: paramRole || '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (user?.phone && !formData.phone) {
      setFormData(prev => ({ ...prev, phone: user.phone || '' }));
    }
  }, [user?.phone || null]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.date || !formData.password || !formData.confirmPassword) {
      // Add notification for required fields
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      // Add notification for password mismatch
      return;
    }

    const { isValid, errors } = validatePassword(formData.password);
    if (!isValid) {
      // Show first error message (you may adapt with toast)
      return;
    }

    const phoneRegex = /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
    if (!phoneRegex.test(formData.phone)) {
      // Add notification for invalid phone
      return;
    }

    const navigate = useNavigate();

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password
    });

    if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
      alert("This email is already registered. Please log in or use 'forgot password' to reset.");
      return;
    }

    alert("Registration successful! Please check your email to confirm your account before signing in.");
    navigate("/login");
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <Input
        id="date"
        type="date"
        label="Preferred Date"
        value={formData.date}
        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        required
        autoComplete="bday"
        className="w-full"
      />

      <Input
        id="name"
        type="text"
        label="Full Name"
        icon={User}
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
        autoComplete="name"
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
        autoComplete="username"
        placeholder="you@example.com"
      />

      <Input
        id="phone"
        type="tel"
        label="Phone Number"
        value={formData.phone || ''}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        required
        autoComplete="tel"
        placeholder="(123) 456-7890"
      />

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
        <select
          id="role"
          name="role"
          value={formData.role || ''}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          required
          className="w-full border-gray-300 rounded p-2"
          disabled={!!paramRole}
        >
          <option value="">Select your role</option>
          <option value="student">Student</option>
          <option value="investor">Investor</option>
          <option value="professional">Professional</option>
          <option value="client">Client</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <Input
        id="password"
        type="password"
        label="Password"
        required
        autoComplete="new-password"
        placeholder="Create a secure password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />

      <Input
        id="confirmPassword"
        type="password"
        label="Confirm Password"
        required
        autoComplete="new-password"
        placeholder="Re-enter your password"
        value={formData.confirmPassword}
        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
      />

      <Button
        type="submit"
        variant="primary"
        className="w-full"
        disabled={!formData.name || !formData.email || !formData.date}
      >
        Register
      </Button>
        </form>
      );
    }
    
