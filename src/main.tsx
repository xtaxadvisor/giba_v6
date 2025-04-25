import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import { BrowserTracing, reactRouterV6Instrumentation } from '@sentry/react';
import { matchRoutes, createRoutesFromChildren } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useLocation, useNavigationType } from 'react-router-dom';
import { createRoot } from 'react-dom/client';

import './styles/global.css';
import './index.css';

import { SupabaseProvider } from './contexts/SupabaseContext';
import { AuthProvider } from './contexts/AuthContext';
import { AppRoutes } from './routes';

import { ChakraProvider, extendTheme } from '@chakra-ui/react';

const rootContainer = document.getElementById('root')!;
const appRoot = createRoot(rootContainer);

const queryClient = new QueryClient();

const sentryInstrumentation = reactRouterV6Instrumentation(
  React.useEffect,
  useLocation,
  useNavigationType,
  createRoutesFromChildren,
  matchRoutes
);

// Create Chakra UI theme
const chakraTheme = extendTheme({});
Sentry.init({
  dsn: 'https://80cda50e3cf066a524158b31ca370667@o4508848989929472.ingest.us.sentry.io/4508848996155392',
  integrations: [new BrowserTracing({ routingInstrumentation: sentryInstrumentation })],
  tracesSampleRate: 1.0,
  environment: import.meta.env.MODE,
});

appRoot.render(
  <React.StrictMode>
    <ChakraProvider theme={chakraTheme}>
      <Sentry.ErrorBoundary fallback={<div className="p-10 text-center text-red-500">Something went wrong.</div>}>
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <SupabaseProvider>
                <AppRoutes />
              </SupabaseProvider>
            </AuthProvider>
          </QueryClientProvider>
        </BrowserRouter>
      </Sentry.ErrorBoundary>
    </ChakraProvider>
  </React.StrictMode>
);

if (import.meta.hot) {
  import.meta.hot.accept();
  import.meta.hot.dispose(() => {
    appRoot.unmount();
  });
}