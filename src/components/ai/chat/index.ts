// src/components/ai/chat/index.ts

// ✅ Export the new AIChat with voice & Whisper support
export { default as AIChat } from '../AIChat';

// ✅ Individual chat components
export { AIMessage } from './AIMessage';
export { AIMessageList } from './AIMessageList';
export { AIMessageInput } from './AIMessageInput';
export { AIContextualHelp } from './AIContextualHelp';
export { AIHeader } from './AIHeader';
export { AIFeedback } from './AIFeedback';
export { AIResponseActions } from './AIResponseActions';

// ✅ Type exports (optional, improves DX)
export type { AIMessage as AIMessageType } from '@/types/ai';
