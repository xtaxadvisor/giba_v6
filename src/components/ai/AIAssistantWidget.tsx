import { useState } from 'react';
import { Bot, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAI } from '../../hooks/useAI';
import { AIChat } from './chat/AIChat';

export function AIAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, sendMessage, isLoading } = useAI();

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          aria-label="Open GRAKON AI"
          title="Open GRAKON AI"
          className="p-4 bg-gradient-to-r from-blue-800 to-blue-900 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          <Bot className="h-6 w-6" aria-hidden="true" />
        </Button>
      </div>

      {isOpen && (
        <div 
          className="fixed bottom-20 right-4 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
          role="dialog"
          aria-label="GRAKON AI Chat"
        >
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <Bot className="h-6 w-6 text-blue-600" />
              <div>
                <h3 className="font-medium text-gray-900">GRAKON AI</h3>
                <p className="text-xs text-gray-500">Tax & Financial Expert</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              icon={X}
              className="text-gray-400 hover:text-gray-500"
            />
          </div>
          <AIChat
            messages={messages}
            onSendMessage={sendMessage}
            isLoading={isLoading}
            // error handling can be implemented here if needed
          />
        </div>
      )}
    </>
  );
}