// AIChat.tsx (Updated for Jennifer with voice support)
import { useState } from 'react';
import { AIMessageList } from './AIMessageList';
import { AIMessageInput } from './AIMessageInput';
import AIWelcomeMessage from '../JenniferVoicePanel';
import { AISuggestions } from '../AISuggestions';
import { AIHeader } from './AIHeader';
import type { AIMessage } from '../../../types/ai';

interface AIChatProps {
  messages: AIMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  error?: Error;
}

export function AIChat({ messages, onSendMessage, isLoading, error }: AIChatProps) {
  const suggestions = [
    'What services do you offer?',
    'How can I schedule a consultation?',
    'What are your business hours?',
    'Do you offer virtual meetings?'
  ];

  const [isVoiceActive, setIsVoiceActive] = useState(false);

  const handleStartVoice = async () => {
    try {
      const res = await fetch('/.netlify/functions/start-jennifer', {
        method: 'POST'
      });
      const { client_secret } = await res.json();

      const ws = new WebSocket(`wss://api.openai.com/v1/realtime/sessions/${client_secret}`);

      ws.onopen = () => {
        console.log('🎙️ Jennifer is listening');
        setIsVoiceActive(true);
      };

      ws.onmessage = async (event) => {
        const json = JSON.parse(event.data);
        const text = json?.content?.[0]?.text;
        if (text) onSendMessage(text);
        setIsVoiceActive(false);
      };

      ws.onerror = (err) => {
        console.error('Jennifer error:', err);
        setIsVoiceActive(false);
      };
    } catch (err) {
      console.error('Voice session error:', err);
      setIsVoiceActive(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px]">
      <AIHeader onClose={() => {}} />

      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <>
            <AIWelcomeMessage />
            <AISuggestions
              suggestions={suggestions}
              onSelect={onSendMessage}
            />
          </>
        ) : (
          <AIMessageList 
            messages={messages} 
            isTyping={isLoading} 
          />
        )}
      </div>

      <div className="flex items-center border-t px-4 py-2">
        <AIMessageInput
          onSend={onSendMessage}
          isDisabled={isLoading}
          placeholder="Type your message..."
        />
        <button
          className="ml-2 px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          onClick={handleStartVoice}
          disabled={isVoiceActive || isLoading}
        >
          🎤 Speak
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 text-sm border-t border-red-100">
          {error.message}
        </div>
      )}
    </div>
  );
}