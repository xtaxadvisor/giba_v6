import React from 'react';
import { Mail, Lock, User, Building } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';

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
  setFormData: React.Dispatch<React.SetStateAction<RegisterFormProps['formData']>>;
  loading: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

const RegisterForm = ({ formData, setFormData, loading, handleSubmit }: RegisterFormProps) => {
  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <Input id="name" type="text" label="Full Name" icon={User} value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required placeholder="John Doe"
      />
      <Input id="email" type="email" label="Email address" icon={Mail} value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required placeholder="you@example.com"
      />
      <Input id="password" type="password" label="Password" icon={Lock} value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        required placeholder="Password"
      />
      <Input id="confirmPassword" type="password" label="Confirm Password" icon={Lock} value={formData.confirmPassword}
        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
        required placeholder="Confirm Password"
      />
      <Select label="Account Type" options={[
        { value: 'client', label: 'Client' },
        { value: 'professional', label: 'Professional' },
        { value: 'investor', label: 'Investor' }
      ]}
        value={formData.role}
        onChange={(value) => setFormData({ ...formData, role: value })}
        required
      />
      <Button type="submit" variant="primary" className="w-full" icon={Building} disabled={loading}>
        {loading ? 'Creating Account...' : 'Create Account'}
      </Button>
    </form>
  );
};

export default RegisterForm;