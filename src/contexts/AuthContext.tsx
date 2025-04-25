import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import type { User } from '../types';
import { supabase } from '@/lib/supabase/client';
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, userData: { name: string; role: string }) => Promise<void>;
  logout: () => Promise<void>;
  signIn: (credentials: { email: string; password: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(
        session?.user && session.user.email
          ? { ...session.user, email: session.user.email, name: '', createdAt: '', location: '', role: '' }
          : null
      );
      setLoading(false);
    });

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(
        session?.user && session.user.email
          ? { ...session.user, email: session.user.email, name: '', createdAt: '', location: '', role: '' }
          : null
      );
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

  const register = async (
    email: string,
    password: string,
    userData: { name: string; role: string }
  ) => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) throw error;
    // Optionally upsert userData to your profiles table here
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    signIn: async ({ email, password }) => login(email, password),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
