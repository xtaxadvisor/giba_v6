import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase/client';

export interface ClientFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface ClientFormProps {
  initialData?: ClientFormData; // Add the initialData property
  onSubmit: (data: ClientFormData) => void;
  onCancel: () => void;
}

export default function ClientForm({ onSubmit, onCancel }: ClientFormProps) {
  const [formData, setFormData] = useState<ClientFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) {
        setFormData(prev => ({ ...prev, email: user.email || '' }));
      }
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    onSubmit(formData);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '2rem auto' }}>
      <h2>Client Information</h2>
      <label>
        First Name
        <input
          name="firstName"
          type="text"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Last Name
        <input
          name="lastName"
          type="text"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Email
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={() => {}}
          disabled
        />
      </label>
      <label>
        Phone
        <input
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </label>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? 'Submitting…' : 'Submit'}
      </button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
}