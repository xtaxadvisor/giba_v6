import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase/client';
import { useNotificationStore } from '@/lib/store';
import type { User } from '@supabase/supabase-js'; // ✅ Make sure it's this one

interface SupabaseContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: { name: string; role: string }) => Promise<void>;
  signOut: () => Promise<void>;
}

interface SupabaseProviderProps {
  children: ReactNode;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

const SupabaseProvider: React.FC<SupabaseProviderProps> = ({ children }): JSX.Element => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { addNotification } = useNotificationStore();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const loadInitialSession = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data?.session;

      if (session && session.user && isMounted) {
        await fetchUserProfile(session.user.id);
      }

      if (isMounted) setLoading(false);
    };

    loadInitialSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await fetchUserProfile(session.user.id);
        }

        if (event === 'SIGNED_OUT') {
          setUser(null);
          navigate('/login');
        }
      }
    );

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  const fetchUserProfile = async (authId: string): Promise<void> => {
    try {
      const { data, error } = await supabase
        .from('profiles')  
        .select('*')
        .eq('auth_id', authId)
       .maybeSingle();

      if (error) throw error;
      setUser(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUser(null);
      navigate('/login');
    }
  };

  const signIn = async (email: string, password: string): Promise<void> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password,
    });

    if (error) throw error;

    // fetch and set the full user profile
    if (data?.session?.user) {
      await fetchUserProfile(data.session.user.id);
    }

    addNotification('Signed in successfully', 'success');
  };

  const signUp = async (email: string, password: string, userData: { name: string; role: string }): Promise<void> => {
    const { error } = await supabase.auth.signUp({
      email: email.toLowerCase().trim(),
      password,
      options: {
        data: userData,
      },
    });

    if (error) throw error;
    addNotification('Account created successfully! Check your email.', 'success');
  };

  const signOut = async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Supabase signOut error:', error.message || error);
      addNotification('Error signing out', 'error');
    } else {
      setUser(null);
      addNotification('Signed out successfully', 'success');
      // Redirect to login
      navigate('/login');
    }
  };

  return React.createElement(
    SupabaseContext.Provider,
    { value: { user, loading, signIn, signUp, signOut } },
    children
  );
};

export { SupabaseProvider };

export function useSupabaseAuth(): SupabaseContextType {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error('useSupabaseAuth must be used within a SupabaseProvider');
  }
  return context;
}