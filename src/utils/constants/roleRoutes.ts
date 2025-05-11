// src/utils/constants/roleRoutes.ts

/**
 * Maps user roles to their respective default portal paths.
 * Used for login redirects, protected routes, and navigation logic.
 */
export type Role = 'admin' | 'professional' | 'investor' | 'student' | 'client' | 'messaging';

export const USER_ROLES: Role[] = [
  'admin',
  'professional',
  'investor',
  'student',
  'client',
  'messaging'
];

export const roleRoutes: Record<Role, string> = {
    admin: '/admin',
    professional: '/professional',
    investor: '/investor',
    student: '/student',
    client: '/client',
    messaging: '/messages', // Optional: general route fallback for all roles
  };

export const defaultRoleRoute = '/client';