import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase/client';
import type { User } from '../types';
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean; // Add this property
}
export interface AuthContextType {
  user: User | null;
  profile: { role: string } | null; // Add the profile property
  // other properties
  setUser: (user: User | null) => void; // Add this line to define setUser
    // other properties
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [profile, setProfile] = useState<{ role: string } | null>(null);
  
  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email ?? '',
          name: session.user.user_metadata?.name ?? '',
          createdAt: session.user.created_at,
          location: session.user.user_metadata?.location ?? '',
          role: session.user.user_metadata?.role ?? '',
          phone: session.user.user_metadata?.phone ?? '',
        });
        const { role } = session.user.user_metadata ?? {};
        setProfile(role ? { role } : null);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    };

    fetchSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? {
        id: session.user.id,
        email: session.user.email ?? '',
        name: session.user.user_metadata?.name ?? '',
        createdAt: session.user.created_at,
        location: session.user.user_metadata?.location ?? '',
        role: session.user.user_metadata?.role ?? '',
        phone: session.user.user_metadata?.phone ?? ''
      } as User : null);
      if (session?.user) {
        const { role } = session.user.user_metadata ?? {};
        setProfile(role ? { role } : null);
      } else {
        setProfile(null);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) throw error;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, logout, isAuthenticated: !!user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export function useSession() {
  const { user } = useAuth();
  return {
    session: user ? { user } : null
  };
}
