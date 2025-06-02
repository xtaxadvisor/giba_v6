// src/main.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import * as Sentry from '@sentry/react';
import { BrowserTracing, reactRouterV6Instrumentation } from '@sentry/react';
import {
  matchRoutes, createRoutesFromChildren,
  useLocation, useNavigationType
} from 'react-router-dom';
import { addInstrumentationHandler } from '@sentry/utils';
import { instrumentFetchRequest } from './utils/instrumentFetch';
import type { Span, HandlerDataFetch } from '@sentry/types';

import './styles/global.css';
import './index.css';

import { Providers } from './Providers';
import AppRoutes from './routes/AppRoutes';
import { JenniferChatProvider } from '@/contexts/JenniferChatContext';
import ErrorBoundary from '@/components/ui/ErrorBoundary'; // ✅ Add this

const rootContainer = document.getElementById('root')!;
const appRoot = createRoot(rootContainer);

// Sentry setup (same as you already had)
const sentryInstrumentation = reactRouterV6Instrumentation(
  React.useEffect, useLocation, useNavigationType,
  createRoutesFromChildren, matchRoutes
);
const spans: Record<string, Span> = {};
Sentry.init({
  dsn: 'https://80cda50e3cf066a524158b31ca370667@o4508848989929472.ingest.us.sentry.io/4508848996155392',
  integrations: [new BrowserTracing({ routingInstrumentation: sentryInstrumentation })],
  tracesSampleRate: 1.0,
  environment: import.meta.env.MODE,
});
addInstrumentationHandler('fetch', (handlerData: HandlerDataFetch) => {
  instrumentFetchRequest(handlerData, () => true, () => true, spans, 'auto.http.browser');
});

console.log('✅ React App is rendering...');
appRoot.render(
<React.StrictMode>
  <ErrorBoundary>
    <Providers>
      <AppRoutes />
    </Providers>
  </ErrorBoundary>
</React.StrictMode>
);

if (import.meta.hot) {
  import.meta.hot.accept();
  import.meta.hot.dispose(() => {
    appRoot.unmount();
  });
}