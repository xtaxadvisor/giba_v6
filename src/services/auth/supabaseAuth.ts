import { supabase as supabaseClient } from '../../lib/supabase/client';
import type { AuthError, User } from '@supabase/supabase-js';
import { createClient as supabaseCreateClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY); // Renamed local import to avoid conflict
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
          uuid: data.user.id,
          full_name: userData.name,
          email: data.user.email ?? '',
          role: userData.role,
          created_at: new Date().toISOString()
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
      .eq('uuid', user.id)
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
function createClient(SUPABASE_URL: string, SUPABASE_ANON_KEY: string) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Supabase URL and ANON KEY must be provided.');
  }
  return supabaseCreateClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
