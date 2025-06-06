// Production-ready ResetPasswordForm component
// Author: ProTaXAdvisors Team

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase/client';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Lock, ArrowLeft } from 'lucide-react';
import { useNotificationStore } from '@/lib/store';
import { motion } from 'framer-motion';

export function ResetPasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { addNotification } = useNotificationStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const trimmedPassword = password.trim();
    const trimmedConfirm = confirmPassword.trim();

    if (!trimmedPassword || !trimmedConfirm) {
      addNotification('Both fields are required.', 'info');
      setLoading(false);
      return;
    }

    if (trimmedPassword !== trimmedConfirm) {
      addNotification('Passwords do not match.', 'error');
      setLoading(false);
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(trimmedPassword)) {
      addNotification(
        'Password must include uppercase, lowercase, number, special character, and be at least 8 characters long.',
        'error'
      );
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ password: trimmedPassword });

      if (error) {
        addNotification(error.message, 'error');
      } else {
        addNotification('🎉 Your password has been reset. Redirecting to login...', 'success');
        setTimeout(() => navigate('/login'), 1500);
      }
    } catch (err) {
      addNotification('Unexpected error. Try again.', 'error');
    }

    setLoading(false);
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gray-50 px-6 py-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      aria-live="polite"
    >
      <div className="max-w-md w-full space-y-6">
        <Button
          variant="ghost"
          className="mb-2"
          onClick={() => navigate('/login')}
          icon={ArrowLeft}
        >
          Back to Login
        </Button>

        <h2 className="text-center text-2xl font-bold text-gray-900">
          Set Your New Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            id="new-password"
            type="password"
            label="New Password"
            icon={Lock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            autoFocus
          />

          <Input
            id="confirm-password"
            type="password"
            label="Confirm Password"
            icon={Lock}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            className="w-full"
            variant="primary"
            disabled={loading}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>
      </div>
    </motion.div>
  );
}

export default ResetPasswordForm;