import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase as importedSupabase } from '../../lib/supabase/client';

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Use the importedSupabase if needed elsewhere in the file
interface AuthContextType {
  user: any | null;
  hydrated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  hydrated: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [hydrated, setHydrated] = useState(true);

  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      console.log('🧠 Hydration session:', session);
      setUser(session?.user ?? null);
      setHydrated(true);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, hydrated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => useContext(AuthContext);
