export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}
// Ensure this file contains the definition and export of AIMessageWithTimestamp
// Removed duplicate declaration of AIMessage to avoid type conflicts

export interface AIMessageWithTimestamp extends AIMessage {
  timestamp: string;
}

export interface AIResponse {
  text: string;
  confidence: number;
  sources?: string[];
}

export interface AIAnalysis {
  sources: never[];
  sentiment: 'positive' | 'negative' | 'neutral';
  topics: string[];
  entities: string[];
  confidence: number;

}export interface AIContext {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  suggestedQuestions: string[];
  [key: string]: unknown; // Allow additional properties if needed
}

export interface AIFeature {
  id: string;
  name: string;
  description: string;
  prompt: string;
}

export interface AIModel {
  id: string;
  name: string;
  description: string;
  features: AIFeature[];
  context: AIContext[];
}
export interface AIFeedback {
  messageId: string;
  rating: number;
  comment?: string;
  context: string;
}
