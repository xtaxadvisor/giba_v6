import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase/client';
import { USER_ROLES } from '@/utils/constants/roleRoutes';

export interface AuthContextType {
  user: User | null;
  logout: () => void;
  setUser: (user: User | null) => void;
  profile: { role: string } | null;
  isAuthenticated: boolean;
  loading: boolean;
  hydrated: boolean;
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
  console.log('🔑 AuthProvider mounted');
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
  // ✅ Rehydrate session from Supabase and localStorage with improved error handling and logging
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        const session = data?.session;

        if (error) {
          console.error('❌ Supabase session error:', error.message);
        }

        console.log('🔁 Supabase returned session from getSession():', session);

        if (!session) {
          console.warn('⚠️ No Supabase session found. User not logged in.');
        }

        if (session?.user?.id) {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('role, full_name, location, phone')
            .eq('id', session.user.id)
            .maybeSingle();

          if (profileError) {
            console.error('❌ Failed to fetch profile:', profileError.message);
          }

          if (profileData) {
            const restoredUser: User = {
              id: session.user.id,
              email: session.user.email ?? '',
              fullName: profileData.full_name ?? '',
              createdAt: session.user.created_at,
              location: profileData.location ?? '',
              role: profileData.role ?? '',
              phone: profileData.phone ?? '',
            };

            setUser(restoredUser);
            setProfile({ role: profileData.role });
            localStorage.setItem('currentUser', JSON.stringify(restoredUser));
          }
        }
      } catch (err) {
        console.error('❌ Error during session hydration:', err);
      } finally {
        setLoading(false);
        setHydrated(true);
      }
    };

    restoreSession();
  }, []);

  // ✅ Watch for login/logout via Supabase listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
        localStorage.removeItem('currentUser');
        navigate('/login');
      }

      if (event === 'SIGNED_IN' && session?.user?.id) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role, full_name, location, phone')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profileError) {
          console.error('❌ Profile fetch error after login:', profileError.message);
        }

        if (profileData) {
          const restoredUser: User = {
            id: session.user.id,
            email: session.user.email ?? '',
            fullName: profileData.full_name ?? '',
            createdAt: session.user.created_at,
            location: profileData.location ?? '',
            role: profileData.role ?? '',
            phone: profileData.phone ?? '',
          };

          setUser(restoredUser);
          setProfile({ role: profileData.role });
          localStorage.setItem('currentUser', JSON.stringify(restoredUser));
        }

        setHydrated(true);
      } else {
        // Always ensure hydration completes even if no session
        setHydrated(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // ✅ Role-based redirect after login, but only after hydration
  useEffect(() => {
    if (!hydrated) return;

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
  }, [user?.role, location.pathname, hydrated]);

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