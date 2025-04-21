import { Button } from "@/components/ui/Button.js";

interface Event {
  title: string;
  date: Date;
  status: string;
}

interface EventDetailsProps { 
  event: Event;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function EventDetails({ event, onClose, onEdit, onDelete }: EventDetailsProps) {
  return (
    <div className="p-4 bg-white shadow-md rounded-md max-w-md">
      {/* Event Title */}
      <h2 className="text-xl font-semibold mb-2">{event.title}</h2>

      {/* Event Date */}
      <p className="text-gray-600">Date: {event.date.toDateString()}</p>

      {/* Event Status */}
      <p className={`mt-2 text-sm font-medium ${event.status === "active" ? "text-green-600" : "text-red-600"}`}>
        Status: {event.status}
      </p>

      {/* Action Buttons */}
      <div className="mt-4 flex justify-end space-x-2">
        <Button onClick={onEdit} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
          Edit
        </Button>
        <Button onClick={onDelete} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
          Delete
        </Button>
        <Button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400">
          Close
        </Button>
      </div>
    </div>
  );
}