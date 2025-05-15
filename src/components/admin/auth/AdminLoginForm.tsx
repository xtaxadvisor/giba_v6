import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, User, Key } from 'lucide-react';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import { useNotificationStore } from '../../../lib/store';
import { adminAuthService } from '../../../services/auth/adminAuth';
import { supabase } from '../../../services/auth/supabaseAuth';
import { isStrongPassword } from '../../../utils/crypto';

export function AdminLoginForm() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    totpCode: ''
  });
  const [loading, setLoading] = useState(false);
  const [showTOTP, setShowTOTP] = useState(false);
  const navigate = useNavigate();
  const { addNotification } = useNotificationStore();

  React.useEffect(() => {
    (async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (session?.user?.id) {
        const { data: adminProfile } = await supabase
          .from('admins')
          .select('id')
          .eq('id', session.user.id)
          .maybeSingle();
        if (adminProfile) {
          navigate('/admin');
        }
      }
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log('Admin login attempt:', { username: formData.username });

    try {
      if (!isStrongPassword(formData.password)) {
        console.warn('Weak password attempt:', formData.username);
        addNotification('Password does not meet security requirements', 'error');
        setLoading(false);
        return;
      }

      const success = await adminAuthService.login(formData);
      console.log('Login result:', { success });
      
      if (success) {
        // Check admin role in Supabase
        // Get current session/user
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !session || !session.user) {
          addNotification('Unable to verify user session.', 'error');
          setLoading(false);
          return;
        }
        const { data: adminProfile, error: adminError } = await supabase
          .from('admins')
          .select('id')
          .eq('id', session.user.id)
          .maybeSingle();
        if (adminError || !adminProfile) {
          addNotification('Access denied: not an admin user.', 'error');
          setLoading(false);
          return;
        }

        if (import.meta.env.DEV || showTOTP) {
          addNotification('Admin access granted', 'success');
          navigate('/admin');
        } else {
          setShowTOTP(true);
          setLoading(false);
          return;
        }
        
      } else {
        console.warn('Failed login for username:', formData.username);
        addNotification('Invalid credentials', 'error');
      }
    } catch (error) {
      console.error('Login error:', error);
      addNotification('Authentication failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-blue-600" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Admin Access Required
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please enter your admin credentials to continue
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {!showTOTP ? (
            <>
              <Input
                type="text"
                label="Username"
                icon={User}
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
                autoComplete="username"
                placeholder="Enter your username"
              />
              <Input
                type="password"
                label="Password"
                icon={Lock}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                autoComplete="current-password"
                placeholder="Enter your password"
              />
            </>
          ) : (
            <Input
              type="text"
              label="Two-Factor Code"
              icon={Key}
              value={formData.totpCode}
              onChange={(e) => setFormData({ ...formData, totpCode: e.target.value })}
              required
              placeholder="Enter your 2FA code"
              pattern="[0-9]{6}"
              maxLength={6}
            />
          )}

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Verifying...' : showTOTP ? 'Verify 2FA Code' : 'Continue'}
          </Button>
        </form>
      </div>
    </div>
  );
}