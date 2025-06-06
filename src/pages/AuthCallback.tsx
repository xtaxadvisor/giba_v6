import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase/client';
import { useNotificationStore } from '@/lib/store';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { addNotification } = useNotificationStore();
  const { setUser } = useAuth();

  useEffect(() => {
    const processLogin = async () => {
      const { data, error } = await supabase.auth.exchangeCodeForSession(window.location.href);

      if (error || !data?.session) {
        addNotification('Login failed. Try again.', 'error');
        navigate('/login');
        return;
      }

      const user = data.session.user;

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('full_name, role, roles')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) {
        console.warn('⚠️ Could not fetch user profile:', profileError.message);
      }

      const hydratedUser = {
        id: user.id,
        email: user.email,
        fullName: profile?.full_name ?? '',
        role: profile?.role ?? '',
        roles: profile?.roles ?? [],
        createdAt: user.created_at,
      };

      setUser(hydratedUser);
      localStorage.setItem('currentUser', JSON.stringify(hydratedUser));

      const roleToPathMap = {
        admin: '/admin/dashboard',
        superadmin: '/superadmin/dashboard',
        client: '/client/dashboard',
        professional: '/professional/dashboard',
        investor: '/investor/dashboard',
        student: '/student/dashboard',
      } as const;

      const primaryRole = (profile?.role || 'client') as keyof typeof roleToPathMap;

      const redirectPath = roleToPathMap[primaryRole] || '/portal-access';

      addNotification(`✅ Welcome back, ${primaryRole}`, 'success');
      setTimeout(() => navigate(redirectPath), 100);
    };

    processLogin();
  }, [navigate, addNotification, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center text-gray-600">
      <p>🔐 Processing your login...</p>
    </div>
  );
}