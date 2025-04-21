import React, { useState, useEffect } from "react";
import { Save } from "lucide-react";

export interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: any;
  onSubmit: (event: any) => void;
  selectedDate: Date | null;
  setSelectedEvent: (event: any) => void;
  setIsEventModalOpen: (isOpen: boolean) => void; // Added this property
}

const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  event,
  onSubmit,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Sync state with the passed `event` prop when it changes
  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description);
    } else {
      setTitle("");
      setDescription("");
    }
  }, [event, isOpen]);

  // Prevent rendering if the modal is not open
  if (!isOpen) return null;

  // Handle form submission
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({ title, description });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-md p-6 w-96">
        <h2 className="text-lg font-semibold mb-4">
          {event ? "Edit Event" : "New Event"}
        </h2>

        <form onSubmit={handleFormSubmit}>
          {/* Title Input */}
          <input
            type="text"
            placeholder="Event Title"
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTitle(e.target.value)
            }
            required
            className="w-full p-2 border rounded mb-3"
          />

          {/* Description Textarea */}
          <textarea
            placeholder="Event Description"
            value={description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setDescription(e.target.value)
            }
            className="w-full p-2 border rounded mb-3"
          />

          {/* Save Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded flex items-center justify-center gap-2"
          >
            <Save size={18} />
            Save
          </button>
        </form>

        {/* Cancel Button */}
        <button
          onClick={onClose}
          className="mt-3 w-full bg-gray-500 hover:bg-gray-600 text-white py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EventModal;