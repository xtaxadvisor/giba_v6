import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase/client';
import { USER_ROLES } from '@/utils/constants/roleRoutes';

export interface AuthContextType {
  user: User | null;
  logout: () => void;
  setUser: (user: User | null) => void;
  profile: { role: string } | null; // Add the profile property
  isAuthenticated: boolean; // Added this property
  loading: boolean; // Add the loading property
  // other properties
}
export interface User {
  id: string;
  email?: string;
  fullName?: string;
  createdAt?: string;
  location?: string;
  role?: string;
  phone?: string;
  avatarUrl?: string;
  userType?: string;
}
// Add the export for AuthProvider if it is missing
export const AuthProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  // Provide authentication context logic here
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<{ role: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    const excludedPaths = ['/register', '/select-role'];
    const isExcluded = excludedPaths.some((path) => location.pathname.startsWith(path));

    if (!isExcluded && user?.role) {
      switch (user.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'professional':
          navigate('/professional');
          break;
        case 'client':
          navigate('/client');
          break;
        case 'investor':
          navigate('/investor');
          break;
        case 'student':
          navigate('/student');
          break;
        default:
          break;
      }
    }
  }, [user?.role, location.pathname]);

  const logout = () => {
    setUser(null);
    setProfile(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        logout,
        setUser,
        profile,
        isAuthenticated,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}


export const AuthContext = React.createContext<AuthContextType | undefined>({
  user: null,
  logout: () => {},
  setUser: () => {},
  profile: null,
  isAuthenticated: false,
  loading: false,
});
