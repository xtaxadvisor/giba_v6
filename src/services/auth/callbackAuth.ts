// src/services/auth/callbackAuth.ts
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNotificationStore } from '@/lib/store';

export function useAuthCallback() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    const completeLogin = async () => {
      try {
        // 🔑 Get current session
        const {
          data: { session },
          error
        } = await supabase.auth.getSession();

        if (error || !session) {
          throw error || new Error('No session found after login.');
        }

        const { user } = session;
        if (!user?.email) {
          throw new Error('User email is missing.');
        }

        // ✅ Fetch profile data from Supabase (e.g., roles, name, etc.)
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('full_name, role, roles')
          .eq('id', user.id)
          .maybeSingle();

        if (profileError) {
          throw profileError;
        }

        const hydratedUser = {
          id: user.id,
          email: user.email,
          fullName: profile?.full_name || '',
          role: profile?.role || '',
          roles: profile?.roles || [],
          createdAt: user.created_at
        };

        // 🔁 Save to context + localStorage
        setUser(hydratedUser);
        localStorage.setItem('currentUser', JSON.stringify(hydratedUser));

        addNotification('✅ You are now logged in', 'success');

        // 📍 Redirect to dashboard or onboarding
        const destination = hydratedUser.role
          ? `/${hydratedUser.role}`
          : '/dashboard';

        navigate(destination);
      } catch (err: any) {
        console.error('⚠️ Auth callback error:', err);
        addNotification(err.message || 'Login failed', 'error');
        navigate('/login');
      }
    };

    completeLogin();
  }, [setUser, navigate, addNotification]);
}