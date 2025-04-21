
interface ClientHistoryProps {
  clientId: string;
}

export function ClientHistory({ clientId }: ClientHistoryProps) {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Client History</h2>
      <p>This section displays the client's interaction history and activity logs.</p>
      <h3>Client ID: {clientId}</h3>
    </div>
  );
}