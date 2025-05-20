import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from '@/lib/supabase/client';
import { HelmetProvider } from 'react-helmet-async';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { chakraTheme } from './theme';
import { AuthProvider } from '@/contexts/AuthContext';
import { SupabaseProvider } from '@/contexts/SupabaseContext';

const queryClient = new QueryClient();

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <HelmetProvider>
      <ChakraProvider theme={chakraTheme}>
        <QueryClientProvider client={queryClient}>
          <SessionContextProvider supabaseClient={supabase}>
            <SupabaseProvider>
              <AuthProvider>
                <BrowserRouter>
                  {children}
                </BrowserRouter>
              </AuthProvider>
            </SupabaseProvider>
          </SessionContextProvider>
        </QueryClientProvider>
      </ChakraProvider>
    </HelmetProvider>
  );
};