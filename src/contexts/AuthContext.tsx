import React, { createContext, useContext, ReactNode } from 'react';
import type { User } from '../types';
import { useState as reactUseState } from 'react';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, userData: { name: string; role: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers: Record<string, User> = {
  professional: {
    id: 'dev-professional',
    name: 'Development Professional',
    email: 'professional@example.com',
    role: 'professional',
    displayName: 'Development Professional',
    avatarUrl: 'https://via.placeholder.com/40',
    createdAt: new Date().toISOString(),
    location: 'Development'
  },
  student: {
    id: 'dev-student',
    name: 'Development Student',
    email: 'student@example.com',
    role: 'student',
    displayName: 'Development Student',
    avatarUrl: 'https://via.placeholder.com/40',
    createdAt: new Date().toISOString(),
    location: 'Development'
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const value: AuthContextType = {
    user: mockUsers.professional,
    loading: false,
    isAuthenticated: true,
    login: async () => {},
    register: async () => {},
    logout: async () => { window.location.href = '/'; },
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuthV2() {
  const context = useContext(AuthContextV2);
  if (context === undefined) {
    throw new Error('useAuthV2 must be used within an AuthProvider');
  }
  return context;
}

interface AuthContextProps {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContextV2 = createContext<AuthContextProps | undefined>(undefined);

export const AuthProviderV2 = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);

  return (
    <AuthContextV2.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContextV2.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
function useState<T>(initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  return reactUseState(initialValue);
}
