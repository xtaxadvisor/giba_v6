import { supabase } from '../../lib/supabase';
import { User } from '../../types'; // Ensure User is exported from '../../types'

class UserService {
  async getByAuthId(authId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', authId)
      .single();

    if (error) throw error;
    return data;
  }

  async updateProfile(userId: string, profile: Partial<User>) {
    const { data, error } = await supabase
      .from('users')
      .update({
        ...profile,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

export const userService = new UserService();