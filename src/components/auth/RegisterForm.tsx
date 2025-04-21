import React, { useState } from 'react';
import { Mail, User } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export function ConsultationForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    date: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.date) {
      // Add notification for required fields
      return;
    }

    window.location.href = "/consultation/confirmation";
    // Add logic to schedule consultation
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
        autoComplete="email"
        placeholder="you@example.com"
      />

      <Button
        type="submit"
        variant="primary"
        className="w-full"
        disabled={!formData.name || !formData.email || !formData.date}
      >
        Schedule Consultation
      </Button>
    </form>
  );
}