import { AIMessageList } from '../ai/chat/AIMessageList';
import { AIMessageInput } from '../ai/chat/AIMessageInput';
import { AIWelcomeMessage } from './AIWelcomeMessage';
import { AISuggestions } from './AISuggestions';
import { AIHeader } from './AIHeader';
import type { AIMessage } from '../../types/ai';

interface AIChatProps {
  messages: AIMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  error?: Error;
  onClose: () => void;
}

export function AIChat({ messages, onSendMessage, isLoading, error, onClose }: AIChatProps) {
  const suggestions = [
    'What tax deductions can I claim?',
    'How do I calculate my estimated taxes?',
    'What documents do I need for tax filing?',
    'Can you explain business tax obligations?'
  ];

  return (
    <div className="flex flex-col h-[500px]">
      <AIHeader onClose={onClose} title="GRAKON AI" />
      
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

      <AIMessageInput
        onSend={onSendMessage}
        isDisabled={isLoading}
        placeholder="Ask me anything about taxes or finance..."
      />

      {error && (
        <div className="p-4 bg-red-50 text-red-600 text-sm border-t border-red-100">
          {error.message}
        </div>
      )}
    </div>
  );
}