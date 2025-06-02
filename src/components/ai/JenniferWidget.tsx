// src/components/ai/JenniferWidget.tsx (Cleaned + Uses AIHeader)
import { useState } from 'react';
import { Bot } from 'lucide-react';
import { Button } from '../ui/Button';
import { useJenniferChat } from '@/hooks/useJenniferChat';
import { AIChat } from './AIChat';

export function JenniferWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, sendMessage, isLoading } = useJenniferChat();

  const handleClose = () => setIsOpen(false);

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          aria-label="Open Jennifer Assistant"
          title="Talk to Jennifer"
          className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          <Bot className="h-6 w-6" aria-hidden="true" />
        </Button>
      </div>

      {/* Chat Modal */}
      {isOpen && (
        <div 
          className="fixed bottom-20 right-4 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
          role="dialog"
          aria-label="Jennifer AI Assistant"
        >
          <AIChat
            messages={messages}
            onSendMessage={sendMessage}
            isLoading={isLoading}
          />
        </div>
      )}
    </>
  );
}