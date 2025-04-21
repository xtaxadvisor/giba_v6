import { useMessages } from '../../hooks/useMessages';
import { LoadingSpinner } from '../ui/LoadingSpinner';

export function MessageItem(props: { message: { id: string; senderId: string; recipientId: string; body: string } }) {
  return (
    <div>
      <p><strong>From:</strong> {props.message.senderId}</p>
      <p><strong>To:</strong> {props.message.recipientId}</p>
      <p>{props.message.body}</p>
    </div>
  );
}
export function MessageList() {
  const { messages, isLoading } = useMessages();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!messages || messages.length === 0) {
    return <p>No messages available.</p>;
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <MessageItem
          key={message.id}
          message={{
            id: message.id,
            senderId: String(message.senderId || ''),
            recipientId: String(message.recipientId || ''),
            body: String(message.body || ''),
          }}
        />
      ))}
    </div>
  );
}
export default MessageList;