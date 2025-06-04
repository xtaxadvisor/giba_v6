import { Bot, User } from 'lucide-react';
import { AIResponseActions } from './AIResponseActions';
import type { AIMessage as AIMessageType } from '@/types/ai';

interface AIMessageProps {
  message: AIMessageType;
  isLast: boolean;
}

export function AIMessage({ message, isLast }: AIMessageProps) {
  const isUser = message.role === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
  };

  const handleFeedback = (isPositive: boolean) => {
    // In production: send this to a feedback table or analytics service
    console.log('✅ Feedback for response:', isPositive);
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      {!isUser && (
        <div className="flex-shrink-0 mr-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <Bot className="h-5 w-5 text-blue-600" />
          </div>
        </div>
      )}

      <div className={`flex flex-col max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`rounded-lg px-4 py-2 text-sm whitespace-pre-wrap ${
            isUser ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'
          }`}
        >
          {message.content}
        </div>

        {/* Show copy/feedback only for assistant and only for the latest message */}
        {!isUser && isLast && (
          <AIResponseActions onCopy={handleCopy} onFeedback={handleFeedback} />
        )}
      </div>

      {isUser && (
        <div className="flex-shrink-0 ml-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="h-5 w-5 text-gray-600" />
          </div>
        </div>
      )}
    </div>
  );
}