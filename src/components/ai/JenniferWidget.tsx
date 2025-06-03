import { useState, useEffect } from 'react';
import { Bot } from 'lucide-react';
import { Button } from '../ui/Button';
import { useJenniferChat } from '@/hooks/useJenniferChat';
import { AIChat } from './AIChat';

const JenniferWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, sendMessage, isLoading } = useJenniferChat();

  // 🧹 Optional: Auto-close if another tab opens a modal or for cleanup logic
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <>
      {/* Floating Open Button */}
      {!isOpen && (
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
      )}

      {/* Chat Modal */}
      {isOpen && (
        <div
          id="jennifer-widget-modal"
          className="fixed bottom-20 right-4 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
          role="dialog"
          aria-label="Jennifer AI Assistant"
        >
          <AIChat
            messages={messages}
            onSendMessage={sendMessage}
            isLoading={isLoading}
            onClose={() => setIsOpen(false)} // ⬅️ This properly unmounts the modal
          />
        </div>
      )}
    </>
  );
};

export default JenniferWidget;