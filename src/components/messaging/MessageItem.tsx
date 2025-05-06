import { FileText, Download } from 'lucide-react';
import { formatTimeAgo } from '../../utils/date';
import type { Message, Attachment } from '../../types';
import { useSession } from '@supabase/auth-helpers-react';

interface MessageItemProps {
  message: Message; // Ensure consistent type for the 'message' property
}
// Removed duplicate and unused MessageItem function

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const session = useSession();
  const currentUserId = session?.user?.id;
  const isOwnMessage = message.senderId === currentUserId;

  return (
    <div className={`flex items-start mb-3 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      {!isOwnMessage && (
        <img
          src={message.profileImageUrl || ''}
          alt={message.senderName || 'User'}
          className="w-8 h-8 rounded-full mr-2 object-cover bg-gray-300"
        />
      )}
      <div
        className={`max-w-lg rounded-lg px-4 py-2 ${
          isOwnMessage ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'
        }`}
      >
        <div className="text-sm font-medium flex items-center justify-between">
          <span>{message.senderName || message.senderId}</span>
          <span className="text-xs opacity-70 ml-2">
            {formatTimeAgo(message.timestamp)}
            {isOwnMessage && message.read && (
              <span className="ml-1 text-green-400">✓✓</span>
            )}
          </span>
        </div>
        <p className="mt-1">{message.content}</p>
        {message.attachments?.map((attachment: Attachment, index: number) => (
          <div key={index} className="mt-2 flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span className="text-sm">{attachment.name}</span>
            <button className="text-sm hover:opacity-75">
              <Download className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
