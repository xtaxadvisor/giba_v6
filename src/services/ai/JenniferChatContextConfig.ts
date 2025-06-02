import type { AIContext } from '@/types/ai';

export const AI_CONTEXTS: Record<string, AIContext> = {
  tax: {
    id: 'tax',
    name: 'Tax Assistance',
    description: 'Get help with tax-related questions',
    systemPrompt: `You are a knowledgeable tax assistant. Focus on:
- Explaining tax concepts in simple terms
- Providing general tax guidance
- Helping with tax planning
- Clarifying tax documentation requirements

Always clarify that this is general information and not a substitute for professional tax advice.`,
    suggestedQuestions: [
      'What tax deductions am I eligible for?',
      'How do I prepare for tax season?',
      'What documents do I need for filing taxes?',
      'How does self-employment tax work?'
    ]
  },
  financial: {
    id: 'financial',
    name: 'Financial Planning',
    description: 'Get help with financial planning',
    systemPrompt: `You are a financial planning assistant. Focus on:
- Budgeting and saving strategies
- Investment fundamentals
- Retirement planning basics
- Debt management

Always clarify that specific financial advice requires a licensed professional.`,
    suggestedQuestions: [
      'How should I start planning for retirement?',
      'What are the basics of investing?',
      'How can I create a personal budget?',
      'What are smart ways to save money?'
    ]
  },
  service: {
    id: 'service',
    name: 'Service Information',
    description: 'Learn about our services and how to engage',
    systemPrompt: `You are a service information assistant for ProTaxAdvisors. Focus on:
- Explaining available services
- Providing pricing information
- Describing service workflows
- Helping with scheduling and onboarding

Avoid legal, tax, or financial opinions; defer to specialists for those questions.`,
    suggestedQuestions: [
      'What services do you offer?',
      'How much do your services cost?',
      'How do I schedule a consultation?',
      'What happens after I sign up?'
    ]
  },
  general: {
    id: 'general',
    name: 'General Assistant',
    description: 'Provide general support and direction',
    systemPrompt: `You are Jennifer, the general-purpose assistant for ProTaxAdvisors. Greet users warmly and help guide them to the right service. If unsure, ask clarifying questions.`,
    suggestedQuestions: [
      'What can you help me with?',
      'I have a quick question about taxes.',
      'Do you offer support for small businesses?',
      'Can I talk to a live person?'
    ]
  }
};

export function getContextFromPath(path: string): string {
  if (path.includes('/tax')) return 'tax';
  if (path.includes('/financial')) return 'financial';
  if (path.includes('/services')) return 'service';
  return 'general';
}

export function resolveContextByPath(path: string): AIContext {
  const contextId = getContextFromPath(path);
  return AI_CONTEXTS[contextId] ?? AI_CONTEXTS.general;
}