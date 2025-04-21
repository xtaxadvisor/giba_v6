import { FileText, Download } from 'lucide-react';
import { formatTimeAgo } from '../../utils/date';
import type { Message, Attachment } from '../../types';

interface MessageItemProps {
  message: Message; // Ensure consistent type for the 'message' property
}
// Removed duplicate and unused MessageItem function

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isOwnMessage = message.senderId === 'currentUserId'; // Replace with actual current user ID logic

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-lg rounded-lg px-4 py-2 ${
          isOwnMessage ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'
        }`}
      >
        <div>
          <span className="font-medium">{message.senderId}</span>
          <span className="text-sm opacity-75 ml-2">
            {formatTimeAgo(message.timestamp)}
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
