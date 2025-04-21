import type { User } from './types';

const USER_STORAGE_KEY = 'currentUser';

// ✅ Save user to localStorage
export type UserRole = 'admin' | 'student' | 'client' | 'investor' | 'professional';

// Removed unused function definition
// Ensure this file exports the required function
export function injectDevSession(newRole: User['role']) {
  const userData = localStorage.getItem(USER_STORAGE_KEY);
  if (userData) {
    const user = JSON.parse(userData) as User;
    user.role = newRole;
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  }
}

export function getCurrentRole() {
  // Example usage of injectDevSession
  injectDevSession('admin');
  // Implementation
}

export function clearDevSession() {
  // Implementation
}
export function storeUser(user: User): void {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
}

// ✅ Retrieve user from localStorage
export function getStoredUser(): User | null {
  const userData = localStorage.getItem(USER_STORAGE_KEY);
  try {
    return userData ? JSON.parse(userData) : null;
  } catch {
    return null;
  }
}

// ✅ Clear user from localStorage
export function clearStoredUser(): void {
  localStorage.removeItem(USER_STORAGE_KEY);
}

// ✅ Validate if user is structurally usable
export function isValidStoredUser(user: User): boolean {
  if (!user?.id || !user?.email || !user?.role) {
    return false;
  }

  // Optional: more secure check if needed
  // if (user.role === 'admin' && !user.permissions?.includes('admin:access')) return false;

  return true;
}