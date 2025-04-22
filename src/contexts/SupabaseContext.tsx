import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase/client';
import { useNotificationStore } from '@/lib/store';
import type { User } from '@/types';

interface SupabaseContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: { name: string; role: string }) => Promise<void>;
  signOut: () => Promise<void>;
}
interface SupabaseProviderProps {
  children: React.ReactNode;
}

export const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined); // eslint-disable-line @typescript-eslint/no-unused-vars 
export const useSupabase = () => useContext(SupabaseContext);
export const SupabaseProvider = ({ children }: SupabaseProviderProps) => {
  // Use SupabaseAuthProvider if needed
  if (!children) return null; // Ensure children is not null or undefined
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const { addNotification } = useNotificationStore();
  
  const fetchUserProfile = async (authId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', authId)
       .maybeSingle();

      if (error) throw error;
      setUser(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUser(null);
      await supabase.auth.signOut();
      navigate('/login');
    }
  };
  
  useEffect(() => {
    let ignore = false;

    const loadUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user && !ignore) {
        await fetchUserProfile(session.user.id);
      }
      setLoading(false);
    };

    setLoading(true);
    loadUser();

    // ✅ Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_, session) => {
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      ignore = true;
      subscription.unsubscribe();
    };
  }, [navigate]);

  // ✅ Sign In
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password
      });

      if (error) throw error;
      addNotification('Successfully signed in', 'success');
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  // ✅ Sign Up
  const signUp = async (email: string, password: string, userData: { name: string; role: string }) => {
    try {
      const { error } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
        options: {
          data: {
            name: userData.name.trim(),
            role: userData.role
          }
        }
      });

      if (error) throw error;
      addNotification('Account created successfully. Please check your email.', 'success');
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  // ✅ Sign Out
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      addNotification('Successfully signed out', 'success');
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut
  };

  return (
    <SupabaseContext.Provider value={value}>
      {children /* Render the children prop */}
    </SupabaseContext.Provider>
  );
};