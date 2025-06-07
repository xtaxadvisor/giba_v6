import { Bot } from 'lucide-react';
import { Button } from '../ui/Button';
import { motion } from 'framer-motion';

interface AIAssistantBubbleProps {
  onOpen: () => void;
  unreadCount?: number;
  status?: 'online' | 'away' | 'busy';
}

export function AIAssistantBubble({ onOpen, unreadCount, status = 'online' }: AIAssistantBubbleProps) {
  const statusColors = {
    online: 'bg-green-500',
    away: 'bg-yellow-400',
    busy: 'bg-red-500',
  };

  return (
    <motion.div
      className="fixed bottom-4 right-4 z-50"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <Button
        onClick={() => {
          // Placeholder for sound effect
          // new Audio('/sounds/assistant-click.mp3').play();
          onOpen();
        }}
        aria-label="Open AI Assistant"
        title="Open AI Assistant"
        className="relative p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:bottom-6 sm:right-6"
      >
        <Bot className="h-6 w-6" />
        {typeof unreadCount === 'number' && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {unreadCount}
          </span>
        )}
        <span
          className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${statusColors[status]}`}
        />
      </Button>
    </motion.div>
  );
}