import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase/client';
import { USER_ROLES } from '@/utils/constants/roleRoutes';

export interface AuthContextType { 
  hydrated: boolean; // ✅ Add this line
}
export interface AuthContextType {
  user: User | null;
  logout: () => void;
  setUser: (user: User | null) => void;
  profile: { role: string } | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface User {
  id: string;
  email?: string;
  fullName?: string;
  createdAt?: string;
  location?: string;
  role?: string;
  phone?: string;
  avatarUrl?: string;
  userType?: string;
}

export const AuthContext = React.createContext<AuthContextType | undefined>({
  user: null,
  logout: () => {},
  setUser: () => {},
  profile: null,
  isAuthenticated: false,
  loading: false,
  hydrated: false,
});

export const AuthProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<{ role: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [hydrated, setHydrated] = useState<boolean>(false);

  const navigate = useNavigate();
  const location = useLocation();
useEffect(() => {
  const storedUser = localStorage.getItem('currentUser');
  if (storedUser) {
    try {
      setUser(JSON.parse(storedUser));
    } catch (error) {
      console.error('Failed to parse stored user from localStorage:', error);
    }
  }
}, []);
  // ✅ Rehydrate session from Supabase and localStorage
  useEffect(() => {
    const restoreSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      const session = data?.session;

      if (session?.user?.id) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('role, full_name, location, phone, avatar_url, user_type')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profileData) {
          const restoredUser: User = {
            id: session.user.id,
            email: session.user.email ?? '',
            fullName: profileData.full_name ?? '',
            createdAt: session.user.created_at,
            location: profileData.location ?? '',
            role: profileData.role ?? '',
            phone: profileData.phone ?? '',
            avatarUrl: profileData.avatar_url ?? '',
            userType: profileData.user_type ?? '',
          };

          setUser(restoredUser);
          setProfile({ role: profileData.role });
          localStorage.setItem('currentUser', JSON.stringify(restoredUser));
        }
      }
      setLoading(false);
      setHydrated(true);
      
    };

    restoreSession();
  }, []);

  // ✅ Watch for login/logout via Supabase listener
  useEffect(() => {
    const { data: subscription } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
        localStorage.removeItem('currentUser');
        navigate('/login');
      }

      if (event === 'SIGNED_IN' && session?.user?.id) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('role, full_name, location, phone, avatar_url, user_type')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profileData) {
          const restoredUser: User = {
            id: session.user.id,
            email: session.user.email ?? '',
            fullName: profileData.full_name ?? '',
            createdAt: session.user.created_at,
            location: profileData.location ?? '',
            role: profileData.role ?? '',
            phone: profileData.phone ?? '',
            avatarUrl: profileData.avatar_url ?? '',
            userType: profileData.user_type ?? '',
          };

          setUser(restoredUser);
          setProfile({ role: profileData.role });
          localStorage.setItem('currentUser', JSON.stringify(restoredUser));
        }
      }
    });

    return () => {
      subscription?.subscription?.unsubscribe();
    };
  }, []);

  // ✅ Role-based redirect after login
  useEffect(() => {
    const excludedPaths = ['/', '/register', '/login', '/select-role']; // ✅ allow homepage and login
    const isExcluded = excludedPaths.some((path) => location.pathname.startsWith(path));

    if (!isExcluded && user?.role) {
      switch (user.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'professional':
          navigate('/professional');
          break;
        case 'client':
          navigate('/client');
          break;
        case 'investor':
          navigate('/investor');
          break;
        case 'student':
          navigate('/student');
          break;
        default:
          break;
      }
    }
  }, [user?.role, location.pathname]);

  const logout = () => {
    supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('accessToken');
    navigate('/login');
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        logout,
        setUser,
        profile,
        hydrated,
        isAuthenticated,
        loading,
      }}
        >
          {children}
        </AuthContext.Provider>
      );
    };

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}