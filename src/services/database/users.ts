import { supabase } from '../../lib/supabase';
import { User } from '../../types'; // Ensure User is exported from '../../types'

class UserService {
  async getByAuthId(authId: string) {
    console.time('[UserService.getByAuthId]');
    console.log('[UserService.getByAuthId] Fetching profile for authId:', authId);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authId)
        .maybeSingle();

      if (error) {
        console.error('[UserService.getByAuthId] Error:', error);
        throw error;
      }
      console.log('[UserService.getByAuthId] Success:', data);
      if (!data) {
        console.warn('[UserService.getByAuthId] No profile found for ID:', authId);
      }
      return data;
    } catch (error) {
      console.error('[UserService.getByAuthId] Error:', error);
      throw error;
    } finally {
      console.timeEnd('[UserService.getByAuthId]');
    }
  }

  async updateProfile(userId: string, profile: Partial<User>) {
    console.time('[UserService.updateProfile]');
    console.log('[UserService.updateProfile] Updating profile for userId:', userId);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...profile,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .maybeSingle();

      if (error) {
        console.error('[UserService.updateProfile] Error:', error);
        throw error;
      }
      console.log('[UserService.updateProfile] Updated data:', data);
      return data;
    } catch (error) {
      console.error('[UserService.updateProfile] Error:', error);
      throw error;
    } finally {
      console.timeEnd('[UserService.updateProfile]');
    }
  }

  async createUser(profile: User) {
    console.time('[UserService.createUser]');
    console.log('[UserService.createUser] Creating user with ID:', profile.id);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert([profile])
        .select()
        .maybeSingle();

      if (error) {
        console.error('[UserService.createUser] Error:', error);
        throw error;
      }
      console.log('[UserService.createUser] Created profile:', data);
      return data;
    } catch (error) {
      console.error('[UserService.createUser] Error:', error);
      throw error;
    } finally {
      console.timeEnd('[UserService.createUser]');
    }
  }
}

export const userService = new UserService();