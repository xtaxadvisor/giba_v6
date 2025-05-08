import { z } from 'zod';

const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character')
  .refine(
    (password) => {
      // Additional check for commonly used passwords
      const commonPasswords = ['password123', 'admin123', 'qwerty123'];
      return !commonPasswords.includes(password.toLowerCase());
    },
    { message: 'Password is too common. Please choose a more secure password.' }
  );

export function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const result = passwordSchema.safeParse(password);
  
  if (!result.success) {
    return {
      isValid: false,
      errors: result.error.errors.map(err => err.message)
    };
  }

  return {
    isValid: true,
    errors: []
  };
}

export function validateEmail(email: string): boolean {
  return z.string().email().safeParse(email).success;
}

export function validatePhoneNumber(phone: string): boolean {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 format or basic global mobile format
  return phoneRegex.test(phone);
}

const usernameSchema = z.string()
  .min(3, 'Username must be at least 3 characters')
  .max(30, 'Username must be no more than 30 characters')
  .regex(/^[a-zA-Z0-9_]+$/, 'Username may only contain letters, numbers, and underscores')
  .refine(
    (username) => !['admin', 'root', 'superuser'].includes(username.toLowerCase()),
    { message: 'This username is reserved. Please choose another one.' }
  );

export function validateUsername(username: string): { isValid: boolean; errors: string[] } {
  const result = usernameSchema.safeParse(username);
  if (!result.success) {
    return {
      isValid: false,
      errors: result.error.errors.map(err => err.message),
    };
  }

  return {
    isValid: true,
    errors: [],
  };
}