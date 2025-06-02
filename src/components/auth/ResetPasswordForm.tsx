import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase/client';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Lock, ArrowLeft } from 'lucide-react';
import { useNotificationStore } from '@/lib/store';

export function ResetPasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { addNotification } = useNotificationStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      addNotification('Both fields are required.', 'info');
      return;
    }

    if (password !== confirmPassword) {
      addNotification('Passwords do not match.', 'error');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[\\W_]).+$/;
    if (!passwordRegex.test(password)) {
      addNotification(
        'Password must include uppercase, lowercase, number, and special character.',
        'error'
      );
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      addNotification(error.message, 'error');
    } else {
      addNotification('Password reset successful!', 'success');
      navigate('/login');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6 py-12">
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
    </div>
  );
}