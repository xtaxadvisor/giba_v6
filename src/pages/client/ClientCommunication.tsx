import React from 'react';
interface ClientCommunicationProps {
  clientId: string;
  recipientId: string; // Add this property
}


// Removed duplicate function definition
export const ClientCommunication: React.FC<ClientCommunicationProps> = ({ clientId }) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Client Communication</h2>
      <p>This is the messaging interface for communicating with the client (ID: {clientId}).</p>
    </div>
  );
};