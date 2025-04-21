import OpenAI from 'openai';
import { useNotificationStore } from '../../lib/store';

// Initialize OpenAI client with environment variable
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export const grakonAI = {
  async getResponse(message: string) {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are GRAKON AI, a tax and financial advisory expert. Provide accurate, professional assistance with tax and financial matters."
          },
          { role: "user", content: message }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      return completion.choices[0]?.message?.content || 'I apologize, but I am unable to provide a response at this time.';
    } catch (error) {
      console.error('OpenAI API Error:', error);
      useNotificationStore.getState().addNotification(
        'Unable to get AI response. Please try again.',
        'error'
      );
      throw error;
    }
  }
};