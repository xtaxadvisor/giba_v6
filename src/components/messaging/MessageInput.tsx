import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { toast } from 'react-toastify';
import { supabase } from '../../lib/supabase/client';

interface MessageInputProps {
  onSendMessage: (
    content: string,
    attachments?: File[],
    threadId?: string,
    assignedTo?: string
  ) => void;
  isLoading?: boolean;
  user?: { id: string; name?: string; role?: string; assignedTo?: string; threadId?: string };
  value: string;
  onChange: (val: string) => void;
}



export function MessageInput({ onSendMessage, isLoading, user }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isUserTyping, setIsUserTyping] = useState(false);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message, attachments, user?.threadId, user?.assignedTo);
      setMessage('');
      setAttachments([]);
      toast.success('Reply sent!');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  return (
    <>
      {user?.name && (
        <div className="px-4 pt-2 pb-1 text-sm text-gray-500">
          Messaging as: <span className="font-semibold text-gray-700">{user.name}</span>
          {user.role && (
            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full uppercase">
              {user.role}
            </span>
          )}
        </div>
      )}
      <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4">
      <div className="flex items-center space-x-4">
        <input
          type="file"
          multiple
          className="hidden"
          id="file-upload"
          name="file-upload"
          onChange={handleFileChange}
        />
        <label htmlFor="file-upload">
          <Button
            type="button"
            variant="ghost"
            icon={Paperclip}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Attach files"
          />
        </label>
        <Input
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            setIsUserTyping(true);
            if (typingTimeout.current) clearTimeout(typingTimeout.current);
            typingTimeout.current = setTimeout(() => {
              setIsUserTyping(false);
              supabase.channel('typing-status').send({
                type: 'broadcast',
                event: 'stop-typing',
                payload: { 
                  senderId: user?.id,
                  senderName: user?.name,
                  senderRole: user?.role
                }
              });
            }, 2000);
            supabase.channel('typing-status').send({
              type: 'broadcast',
              event: 'typing',
              payload: { 
                senderId: user?.id,
                senderName: user?.name,
                senderRole: user?.role
              }
            });
          }}
          placeholder="Type your message..."
          className="flex-1"
          disabled={isLoading}
          id="message-input"
          name="message"
          aria-label="Message content"
        />
        <Button
          type="submit"
          variant="primary"
          icon={Send}
          disabled={isLoading || !message.trim()}
          aria-label="Send message"
        >
          Send
        </Button>
      </div>
      {attachments.length > 0 && (
        <div className="mt-2 space-y-1">
          {attachments.map((file, index) => (
            <div key={index} className="text-sm text-gray-500">
              {file.name}
            </div>
          ))}
        </div>
      )}
      {isUserTyping && (
        <div className="mt-1 text-xs text-gray-400">You are typing...</div>
      )}
    </form>
    </>
  );
}