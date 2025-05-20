import React, { createContext, useContext, useEffect, useState } from 'react';
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
  let addNotification: (message: string, type?: 'error' | 'success' | 'info') => void = () => {};
  try {
    const store = useNotificationStore();
    addNotification = store.addNotification ?? (() => {});
  } catch (err) {
    console.warn('🔁 Notification store not ready:', err);
  }

  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  
  const fetchUserProfile = async (authId: string) => {
    try {
      if (!authId || authId.trim() === '') {
        console.warn('No valid authId provided to fetchUserProfile. Skipping profile fetch.');
        return;
      }

      const { data, error } = await supabase
        .from('profiles')  
        .select('*')
        .eq('id', authId)
        .maybeSingle();

      if (error) throw error;
      setUser(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUser(null);
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        console.error('Error signing out during fetchUserProfile catch:', signOutError.message || signOutError);
      }
      window.location.href = '/login';
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
  }, []);

useEffect(() => {
  try {
    addNotification("Notification initialized", "info");
  } catch (error) {
    console.warn("Notification store not ready:", error);
  }
}, []);

  // ✅ Sign In
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password
      });

      if (error) throw error;
      // on successful sign-in, load the user profile
      if (data.session?.user) {
        await fetchUserProfile(data.session.user.id);
      }
      addNotification("Notification initialized", "info");
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };
  

  // ✅ Sign Up with strong client-side validation
  const signUp = async (email: string, password: string, userData: { name: string; role: string }) => {
    try {
      const cleanEmail = email.toLowerCase().trim();

      // Validate email structure
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cleanEmail)) {
        throw new Error('Invalid email format. Please provide a valid email address.');
      }

      // Block placeholder or AWS emails
      if (
        cleanEmail.includes('no-reply') ||
        cleanEmail.includes('verification') ||
        cleanEmail.includes('amazonaws.com')
      ) {
        throw new Error('Invalid email. Please use a valid personal or business email address.');
      }

      const { error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            name: userData.name.trim(),
            role: userData.role
          }
        }
      });

      if (error) throw error;
      addNotification("Notification initialized", "info");
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  // ✅ Sign Out
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error.message || error);
        throw error;
      }
      setUser(null);
      addNotification("Notification initialized", "info");
      window.location.href = '/';
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