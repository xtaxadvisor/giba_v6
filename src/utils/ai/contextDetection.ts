import type { AIContext } from '../../types/ai';

export function detectContext(input: string): AIContext {
  const taxKeywords = ['tax', 'deduction', 'filing', 'irs', 'return'];
  const financialKeywords = ['invest', 'budget', 'savings', 'retirement', 'portfolio'];
  const serviceKeywords = ['service', 'consultation', 'appointment', 'schedule', 'meeting'];

  const lowercaseInput = input.toLowerCase();

  if (taxKeywords.some(keyword => lowercaseInput.includes(keyword))) {
    return {
      id: '1',
      name: 'Tax Context',
      description: 'Context related to tax-related queries',
      systemPrompt: 'Provide tax-related assistance.',
      suggestedQuestions: [
        'What tax deductions can I claim?',
        'When is the tax filing deadline?',
        'Do I need to file quarterly taxes?'
      ]
    };
  }
  if (financialKeywords.some(keyword => lowercaseInput.includes(keyword))) {
    return {
      id: '2',
      name: 'Financial Context',
      description: 'Context related to financial planning and investments',
      systemPrompt: 'Provide financial planning assistance.',
      suggestedQuestions: [
        'How should I start investing?',
        'What retirement accounts do you recommend?',
        'How can I improve my financial planning?'
      ]
    };
  }
  if (serviceKeywords.some(keyword => lowercaseInput.includes(keyword))) {
    return {
      id: '3',
      name: 'Service Context',
      description: 'Context related to services offered',
      systemPrompt: 'Provide information about services offered.',
      suggestedQuestions: [
        'What services do you offer?',
        'How can I schedule a consultation?',
        'What are your fees?'
      ]
    };
  }

  return {
    id: '4',
    name: 'General Context',
    description: 'General context for miscellaneous queries',
    systemPrompt: 'Provide general assistance.',
    suggestedQuestions: [
      'Tell me more about your company',
      'How can you help me?',
      'What are your business hours?'
    ]
  };
}
export function getContextualSuggestions(context: AIContext): string[] {
  const suggestions: Record<string, string[]> = {
    tax: [
      'What tax deductions can I claim?',
      'When is the tax filing deadline?',
      'Do I need to file quarterly taxes?'
    ],
    financial: [
      'How should I start investing?',
      'What retirement accounts do you recommend?',
      'How can I improve my financial planning?'
    ],
    service: [
      'What services do you offer?',
      'How can I schedule a consultation?',
      'What are your fees?'
    ],
    general: [
      'Tell me more about your company',
      'How can you help me?',
      'What are your business hours?'
    ],
    visitor: [
      'What can I do as a visitor?',
      'How do I navigate your platform?',
      'What features are available for visitors?'
    ]
  };

  return suggestions[context.id] || suggestions.general;
}
