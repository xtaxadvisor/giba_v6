// ✅ src/components/ai/JenniferWidget.tsx
import { useState } from 'react';
import { Bot, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { useJenniferChat } from '@/hooks/useJenniferChat';
import { AIChat } from './AIChat';

const JenniferWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, sendMessage, isLoading } = useJenniferChat();

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={handleOpen}
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
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 rounded-full">
                <Bot className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Jennifer</h3>
                <p className="text-xs text-gray-500">Your AI Assistant</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              icon={X}
              className="text-gray-500 hover:text-gray-700"
            />
          </div>

          <AIChat
            messages={messages}
            onSendMessage={sendMessage}
            isLoading={isLoading}
            onClose={handleClose}
          />
        </div>
      )}
    </>
  );
};

export default JenniferWidget;