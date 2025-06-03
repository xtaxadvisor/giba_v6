// src/components/ai/index.ts (Safeguarded export file)

// Remove this risky line:
// export { default as Jennifer } from './JenniferWidget';

// Only export explicitly when needed
export { default as AIWelcomeMessage } from './JenniferVoicePanel';
export { AISuggestions } from './AISuggestions';
export { AITypingIndicator } from './AITypingIndicator';
export * from './chat';