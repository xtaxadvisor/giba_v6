import { supabase } from '../../lib/supabase/client';
import type { AuthError, User } from '@supabase/supabase-js';

export const supabaseAuth = {
  async signUp(email: string, password: string, userData: { 
    name: string;
    role: string;
  }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: userData.name,
          role: userData.role
        }
      }
    });

    if (error) throw error;
    
    if (data.user) {
      // Create profile in users table
      const { error: profileError } = await supabase
        .from('profiles')  
        .insert({
          auth_id: data.user.id,
          name: userData.name,
          email: data.user.email!,
          role: userData.role
        });

      if (profileError) throw profileError;
    }

    return data;
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) console.error("Sign‑in failed:", error.message);
    else console.log("Signed in user:", data.user);
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    // Redirect to login after sign out
    window.location.href = '/login';
  },

  async getCurrentUser(): Promise<{ user: User; profile: any } | null> {
    // get auth user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) return null;

    // get profile from users table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')  
      .select('*')
      .eq('id', user.id)
      .maybeSingle();
    if (profileError) throw profileError;

    return { user, profile };
  },

  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  },

  async updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    if (error) throw error;
  },

  onAuthStateChange(
    callback: (sessionUser: { user: User; profile: any } | null, error?: AuthError) => void
  ) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        // Session expired or invalid refresh token
        window.location.href = '/login';
        return callback(null, undefined);
      }

      if (session?.user) {
        try {
          const current = await this.getCurrentUser();
          callback(current, undefined);
        } catch (err: any) {
          callback(null, err);
        }
      }
    });
  }
};