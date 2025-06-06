import React, { useState, useContext, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { USER_ROLES } from '@/utils/constants/roleRoutes';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export interface AuthContextType {
  user: User | null;
  logout: () => void;
  setUser: (user: User | null) => void;
  profile: { role: string } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hydrated: boolean;
  resolvedRole: string | null;
}

export interface User {
  onboardingcomplete: boolean;
  id: string;
  email?: string;
  fullName?: string;
  createdAt?: string;
  location?: string;
  role?: string;
  roles?: string[]; // ✅ ADD THIS
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
  isLoading: false,
  hydrated: true,
  resolvedRole: null,
});

export const AuthProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  console.log('🔑 AuthProvider mounted');
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<{ role: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [hydrated, setHydrated] = useState<boolean>(true);
  const [resolvedRole, setResolvedRole] = useState<string | null>(null);

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
        let session = data?.session;

        if (error) {
          console.error('❌ Supabase session error:', error.message);
        }

        console.log('🔁 Supabase returned session from getSession():', session);

        if (!session) {
          const { data: userData, error: userError } = await supabase.auth.getUser();
          if (userError) {
            console.warn('⚠️ Fallback getUser error:', userError.message);
          }
          if (userData?.user?.id && !session) {
            console.log('🔄 No session, but user found via getUser fallback:', userData.user);
            session = { user: userData.user } as any;
          }
          if (!session) {
            console.warn('⚠️ No Supabase session found. User not logged in.');
          }
        }

        if (session?.user?.id) {
          let profileData = null;
          let profileError = null;
          try {
            const response = await supabase
              .from('profiles')
              .select('role, roles, full_name, location, phone')
              .eq('id', session.user.id)
              .maybeSingle();
            profileData = response.data;
            profileError = response.error;
          } catch (fetchError) {
            console.error('❌ Exception while fetching profile data:', fetchError);
          }

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
              roles: profileData.roles ?? [profileData.role], // fallback if roles missing
              phone: profileData.phone ?? '',
              onboardingcomplete: false
            };

            setUser(restoredUser);
            setResolvedRole(restoredUser.roles?.[0] || restoredUser.role || null);
            setProfile({ role: profileData.role });
            localStorage.setItem('currentUser', JSON.stringify(restoredUser));
          } else {
            setResolvedRole(null);
          }
        } else {
          setResolvedRole(null);
        }
      } catch (err) {
        console.error('❌ Error during session hydration:', err);
        setResolvedRole(null);
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
        setResolvedRole(null);
        localStorage.removeItem('currentUser');
        window.location.href = '/login';
      }

      if (event === 'SIGNED_IN' && session?.user?.id) {
        let profileData = null;
        let profileError = null;
        try {
          const response = await supabase
            .from('profiles')
            .select('role, roles, full_name, location, phone')
            .eq('id', session.user.id)
            .maybeSingle();
          profileData = response.data;
          profileError = response.error;
        } catch (fetchError) {
          console.error('❌ Exception while fetching profile data:', fetchError);
        }

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
            roles: profileData.roles ?? [profileData.role], // Ensure roles array is used
            phone: profileData.phone ?? '',
            onboardingcomplete: false
          };

          setUser(restoredUser);
          setResolvedRole(restoredUser.roles?.[0] || restoredUser.role || null);
          setProfile({ role: profileData.role });
          localStorage.setItem('currentUser', JSON.stringify(restoredUser));
        } else {
          setResolvedRole(null);
        }
        setHydrated(true);
      } else {
        // Always ensure hydration completes even if no session
        setResolvedRole(null);
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

    const publicPaths = ['/login', '/register', '/select-role'];
    const isOnPublicPath = publicPaths.some((path) => window.location.pathname.startsWith(path));

    if (isOnPublicPath && user?.role) {
      const roleRoutes = {
        admin: '/admin',
        professional: '/professional',
        client: '/client',
        investor: '/investor',
        student: '/student',
      };
      const target = roleRoutes[user.role as keyof typeof roleRoutes];
      if (target) window.location.href = target;
    }
  }, [user?.role, hydrated]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const logout = () => {
    supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setResolvedRole(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('accessToken');
    window.location.href = '/login';
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
        isLoading: loading,
        resolvedRole,
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