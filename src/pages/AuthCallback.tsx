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
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error || !session) {
        console.error('🔴 Auth session missing or failed:', error);
        addNotification('Login failed. Please try again.', 'error');
        navigate('/login');
        return;
      }

      const user = session.user;
      console.log('🔐 Supabase session found:', user.email);

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('full_name, role, roles')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) {
        console.warn('⚠️ No profile found:', profileError.message);
      }

      const hydratedUser = {
        id: user.id,
        email: user.email,
        fullName: profile?.full_name ?? '',
        role: profile?.role ?? '',
        roles: profile?.roles ?? [],
        createdAt: user.created_at
      };

      setUser(hydratedUser);
      localStorage.setItem('currentUser', JSON.stringify(hydratedUser));

      type Role = 'admin' | 'client' | 'professional' | 'investor' | 'student';
      const primaryRole: Role = (profile?.role as Role) || 'client';

      const redirectPath = {
        admin: '/admin/dashboard',
        client: '/client/dashboard',
        professional: '/professional/dashboard',
        investor: '/investor/dashboard',
        student: '/student/dashboard'
      }[primaryRole] || '/dashboard';

      addNotification(`✅ Welcome back, ${primaryRole}`, 'success');
      navigate(redirectPath);
    };

    processLogin();
  }, [navigate, addNotification, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center text-gray-600">
      <p>🔐 Processing your login...</p>
    </div>
  );
}