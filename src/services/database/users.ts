import { supabase } from '../../lib/supabase';
import { User } from '../../types'; // Ensure User is exported from '../../types'

class UserService {
  async getByAuthId(authId: string) {
    const { data, error } = await supabase
      .from('profiles')  
      .select('*')
      .eq('id', authId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async updateProfile(userId: string, profile: Partial<User>) {
    const { data, error } = await supabase
<<<<<<< HEAD
      .from('profiles')
=======
      .from('profiles')  
>>>>>>> 6c9ca0690d78f9046084d6a8e6eca28a36da4027
      .update({
        ...profile,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  }
}

export const userService = new UserService();