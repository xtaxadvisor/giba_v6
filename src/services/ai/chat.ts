export interface ChatMessage {
  id: string;
  consultationId: string;
  sender: string;
  senderId: string;
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'failed';
}

export interface SendMessageDTO {
  consultationId: string;
  content: string;
  sender: string;
  senderId: string;
}

export const chatService = {
  getMessages: (consultationId: string): Promise<ChatMessage[]> => {
    console.log(`Fetching messages for consultation ID: ${consultationId}`);
    return Promise.resolve([]); // Implement actual API call
  },

  sendMessage: (data: SendMessageDTO): Promise<ChatMessage> => {
    console.log('Sending message:', data);
    return Promise.resolve({
      id: 'temp-id',
      consultationId: data.consultationId,
      sender: data.sender,
      senderId: data.senderId,
      content: data.content,
      timestamp: new Date().toISOString(),
      status: 'sent'
    });
  },

  deleteMessage: (messageId: string): Promise<void> => {
    console.log(`Deleting message with ID: ${messageId}`);
    return Promise.resolve();
  },

  retryMessage: (messageId: string): Promise<ChatMessage> => {
    console.log(`Retrying message with ID: ${messageId}`);
    return Promise.resolve({
      id: messageId,
      consultationId: 'unknown',
      sender: 'unknown',
      senderId: 'unknown',
      content: 'Retried message content',
      timestamp: new Date().toISOString(),
      status: 'sent'
    });
  },

  markAsDelivered: (messageId: string): Promise<void> => {
    console.log(`Marking message with ID: ${messageId} as delivered`);
    return Promise.resolve();
  }
};