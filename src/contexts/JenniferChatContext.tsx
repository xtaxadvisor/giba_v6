import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect
} from 'react';
import { useLocation } from 'react-router-dom';
import {
  AI_CONTEXTS,
  getContextFromPath
} from '@/services/ai/JenniferChatContextConfig';
import type { AIContext } from '@/types/ai';

interface JenniferContextType {
  context: AIContext;
  setContextId: (id: string) => void;
}

// ✅ Context initialization
const JenniferChatContext = createContext<JenniferContextType | undefined>(undefined);

// ✅ Provider component
export const JenniferChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const initialContextId = getContextFromPath(location.pathname);
  const [contextId, setContextId] = useState<string>(initialContextId);

  // 🧠 Update context on path change
  useEffect(() => {
    const newContextId = getContextFromPath(location.pathname);
    setContextId(newContextId);
  }, [location.pathname]);

  const value = useMemo(() => {
    return {
      context: AI_CONTEXTS[contextId] || AI_CONTEXTS.general,
      setContextId
    };
  }, [contextId]);

  return (
    <JenniferChatContext.Provider value={value}>
      {children}
    </JenniferChatContext.Provider>
  );
};

// ✅ Consumer hook
export function useJenniferContext(): JenniferContextType {
  const ctx = useContext(JenniferChatContext);
  if (!ctx) throw new Error('useJenniferContext must be used inside <JenniferChatProvider>');
  return ctx;
}