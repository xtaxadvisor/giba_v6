import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { useMessages } from '../../hooks/useMessages';
import { useSession } from '../../contexts/AuthContext';

export function MessagingCenter({ recipientId }: { recipientId: string }) {
  const { sendMessage, isSending } = useMessages();
  const { session } = useSession();
  const senderId = session?.user?.id;

  const handleSendMessage = (content: string, attachments?: File[]) => {
    if (!recipientId || !senderId) return;

    sendMessage({
      recipientId,
      senderId, // Assuming senderId is needed for the message  
      content,
      attachments: attachments?.map(file => file.name) // In a real app, you'd upload files
    });
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col bg-white rounded-lg shadow">
      <div className="border-b border-gray-200 p-4">
        <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <MessageList recipientId={recipientId} />
      </div>

      <MessageInput 
        onSendMessage={handleSendMessage}
        isLoading={isSending}
      />
    </div>
  );
}