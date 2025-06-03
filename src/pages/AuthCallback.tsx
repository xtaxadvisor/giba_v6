// src/pages/AuthCallback.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase/client';
import { useNotificationStore } from '@/lib/store';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    const processLogin = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error || !session) {
        console.error('🔴 Auth session missing or failed:', error);
        addNotification('Login failed. Please try again.', 'error');
        navigate('/login');
        return;
      }

      const user = session.user;
      console.log('🔐 Supabase session found:', user.email);

      // Fetch the profile to get role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError || !profile?.role) {
        console.warn('⚠️ No profile role found, redirecting to default dashboard');
        navigate('/dashboard');
        return;
      }

      const role = profile.role as 'admin' | 'client' | 'professional' | 'investor' | 'student';
      const redirectPath = {
        admin: '/admin/dashboard',
        client: '/client/dashboard',
        professional: '/professional/dashboard',
        investor: '/investor/dashboard',
        student: '/student/dashboard'
      }[role] || '/dashboard';

      addNotification(`✅ Welcome back, ${role}`, 'success');
      navigate(redirectPath);
    };

    processLogin();
  }, [navigate, addNotification]);

  return (
    <div className="min-h-screen flex items-center justify-center text-gray-600">
      <p>🔐 Processing your login...</p>
    </div>
  );
}
