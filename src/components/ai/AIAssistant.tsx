import { useState, useRef, useEffect } from 'react';
import { AIAssistantBubble } from './AIAssistantBubble';
import { AIChat } from './AIChat';
import { useClickOutside } from '../../utils/hooks';

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const chatRef = useRef<HTMLDivElement>(null);

  useClickOutside(chatRef, () => {
    if (isOpen) setIsOpen(false);
  });


  const handleOpen = () => {
    setIsOpen(true);
    setUnreadCount(0);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      setIsOpen(false);
    };
  }, []);

  return (
    <>
      <AIAssistantBubble 
        onOpen={handleOpen} 
        unreadCount={unreadCount} 
      />
      {isOpen && (
        <div ref={chatRef}>
          <AIChat 
            messages={[]} 
            onSendMessage={(message) => console.log('Message sent:', message)} 
            isLoading={false} 
            onClose={handleClose}
          />
        </div>
      )}
    </>
  );
}