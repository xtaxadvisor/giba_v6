// src/services/auth/callbackAuth.ts

import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotificationStore } from '@/lib/store';

export function useAuthCallback() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    const completeLogin = async () => {
      try {
        const {
          data: { session },
          error
        } = await supabase.auth.getSession();

        if (error || !session) {
          throw error || new Error('No session found after login.');
        }

        const user = session.user;
        if (!user?.email) {
          throw new Error('User email is missing.');
        }

        setUser(user);
        addNotification('✅ You are now logged in', 'success');

        // Optional: You can route based on role stored in metadata or profiles
        // Example: redirect to different dashboards
        navigate('/dashboard');
      } catch (err: any) {
        console.error('Auth callback error:', err);
        addNotification(err.message || 'Login failed', 'error');
        navigate('/login');
      }
    };

    completeLogin();
  }, []);
}