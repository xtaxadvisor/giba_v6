import { supabase } from '../../lib/supabase/client';
import { useNotificationStore } from '../../lib/store';
import { validatePassword } from './validation';
import type { AuthError } from '@supabase/supabase-js';

export class AuthService {
  private static readonly MAX_RETRIES = 3;

  static async signIn(email: string, password: string) {
    try {
      // Normalize email
      const normalizedEmail = email.toLowerCase().trim();
      
      // Development mode mock credentials
      if (process.env.NODE_ENV === 'development') {
        const mockCredentials = [
          { email: 'admin@protaxadvisors.tax', password: 'Admin123!@#', role: 'admin' },
          { email: 'client@example.com', password: 'Client123!@#', role: 'client' },
          { email: 'professional@example.com', password: 'Professional123!@#', role: 'professional' },
          { email: 'investor@example.com', password: 'Investor123!@#', role: 'investor' },
          { email: 'student@example.com', password: 'Student123!@#', role: 'student' }
        ];

        const mockUser = mockCredentials.find(cred => 
          cred.email === normalizedEmail && cred.password === password
        );

        if (mockUser) {
          useNotificationStore.getState().addNotification(
            'Logged in with development credentials',
            'success'
          );
          
          return {
            id: `mock-${Date.now()}`,
            email: mockUser.email,
            role: mockUser.role,
            name: mockUser.role.charAt(0).toUpperCase() + mockUser.role.slice(1),
            created_at: new Date().toISOString()
          };
        }
      }

      // Try Supabase authentication with retries
      let lastError: AuthError | null = null;
      for (let attempt = 0; attempt < this.MAX_RETRIES; attempt++) {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: normalizedEmail,
            password
          });

          if (error) throw error;

          // Get user profile
          const { data: profile, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('auth_id', data.user.id)
            .maybeSingle();

          if (profileError) throw profileError;

          useNotificationStore.getState().addNotification(
            'Successfully signed in',
            'success'
          );

          return profile;
        } catch (error) {
          lastError = error as AuthError;
          if ((error as AuthError).message !== 'Failed to fetch') {
            break; // Don't retry if it's not a network error
          }
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
        }
      }

      if (lastError) throw lastError;
      throw new Error('Authentication failed after retries');

    } catch (error) {
      this.handleAuthError(error as AuthError);
      return null;
    }
  }

  static async signUp(email: string, password: string, userData: {
    name: string;
    role: string;
  }) {
    try {
      // Validate password
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.errors[0]);
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
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
        // Create user profile
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            auth_id: data.user.id,
            name: userData.name,
            email: data.user.email!,
            role: userData.role
          });

        if (profileError) throw profileError;
      }

      useNotificationStore.getState().addNotification(
        'Account created successfully! Please check your email.',
        'success'
      );
    } catch (error) {
      this.handleAuthError(error as AuthError);
      throw error;
    }
  }

  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      useNotificationStore.getState().addNotification(
        'Successfully signed out',
        'success'
      );
    } catch (error) {
      this.handleAuthError(error as AuthError);
      throw error;
    }
  }

  private static handleAuthError(error: AuthError) {
    const errorMessages: Record<string, string> = {
      'invalid_credentials': 'Invalid email or password. Please check your credentials and try again.',
      'invalid_grant': 'Invalid email or password. Please check your credentials and try again.',
      'user_not_found': 'No account found with this email address.',
      'email_taken': 'An account with this email already exists.',
      'weak_password': 'Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters.',
      'rate_limit_exceeded': 'Too many attempts. Please try again in a few minutes.',
      'expired_token': 'Your session has expired. Please sign in again.',
      'invalid_token': 'Invalid authentication token. Please sign in again.'
    };

    const message = errorMessages[error.message] || error.message || 'An unexpected error occurred';
    useNotificationStore.getState().addNotification(message, 'error');
  }
}