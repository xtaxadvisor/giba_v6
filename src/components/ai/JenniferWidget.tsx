import { useState, useEffect } from 'react';
import { Bot, X } from 'lucide-react';
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
            title="Talk to Jennifer AI"
            className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <Bot className="h-6 w-6" aria-hidden="true" />
          </Button>
        </div>
      )}

      {/* Chat Modal with Transition and Scrollable Container */}
      {isOpen && (
        <div
          id="jennifer-widget-modal"
          className="fixed bottom-20 right-4 w-[400px] backdrop-blur-md bg-white/90 rounded-lg shadow-2xl border border-gray-200 z-50 transition-all duration-300 ease-out animate-fade-in-up"
          role="dialog"
          aria-label="Jennifer AI Assistant"
        >
          <div className="relative h-[70vh] flex flex-col bg-white rounded-lg p-4 overflow-hidden shadow-2xl border border-gray-300">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 focus:outline-none"
              aria-label="Close Jennifer Assistant"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex-1 overflow-y-auto pr-2 scroll-smooth" id="jennifer-chat-scroll-container">
              <div className="animate-fade-in transition-all duration-300">
                <AIChat
                  messages={messages}
                  onSendMessage={sendMessage}
                  isLoading={isLoading}
                  onClose={() => setIsOpen(false)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default JenniferWidget;