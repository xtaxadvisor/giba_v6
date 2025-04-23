import { supabase } from '@/lib/supabase/client';
import { useNotificationStore } from '@/lib/store';
import type { User } from '@/types';

interface SignUpPayload {
  name: string;
  role: string;
}

export const authService = {
  // ✅ Sign In
  async signIn(email: string, password: string): Promise<User | null> {
    try {
      const {
        data: { session, user },
        error,
      } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password,
      });
      if (error) throw error;
      if (!user) {
        useNotificationStore.getState().addNotification(
          'Authentication succeeded but no user data was returned',
          'error'
        );
        return null;
      }
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', user.id)
        .maybeSingle();

      if (profileError || !profile) {
        useNotificationStore.getState().addNotification(
          'Profile not found for this user',
          'error'
        );
        return null;
      }

      return profile;
    } catch (error) {
      console.error('[authService] Sign in error:', error);
      useNotificationStore.getState().addNotification(
        'Invalid email or password',
        'error'
      );
      throw error;
    }
  },

  // ✅ Sign Up
  async signUp(email: string, password: string, userData: SignUpPayload): Promise<void> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
        options: {
          data: {
            name: userData.name,
            role: userData.role,
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            auth_id: data.user.id,
            name: userData.name,
            email: data.user.email!,
            role: userData.role,
          });

        if (profileError) throw profileError;
      }

      useNotificationStore.getState().addNotification(
        'Account created successfully! Please check your email.',
        'success'
      );
    } catch (error) {
      console.error('[authService] Sign up error:', error);
      useNotificationStore.getState().addNotification(
        'Failed to create account',
        'error'
      );
      throw error;
    }
  },

  // ✅ Sign Out
  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();

    if (error) {
      useNotificationStore.getState().addNotification(
        'Failed to sign out',
        'error'
      );
      throw error;
    }

    useNotificationStore.getState().addNotification(
      'You have been signed out',
      'success'
    );
  },

  // ✅ Get current logged-in user (with profile)
  async getCurrentUser(): Promise<User | null> {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return null;

    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', user.id)
      .maybeSingle();

    if (profileError || !profile) {
      console.warn('[authService] No profile found for auth user ID:', user.id);
      return null;
    }

    return profile;
  }
};