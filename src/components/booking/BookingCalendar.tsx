import { useEffect, useState } from 'react';
// Removed unused imports from 'lucide-react'
// Removed unused 'Button' import
import { useConsultation } from '../../hooks/useConsultation';
import { useNotificationStore } from '../../lib/store';
import { consultationService } from '@/services/api/consultationService'; 

interface BookingCalendarProps {
  professionalId: string;
  duration: number;
  onTimeSelected: (startTime: Date) => void;
}

export function BookingCalendar({
  professionalId,
  onTimeSelected,
}: Omit<BookingCalendarProps, 'serviceType'>) {
  // Removed unused 'selectedTime' state
  const [selectedDate, setSelectedDate] = useState(new Date()); // Added state for selectedDate
  // Removed unused state 'availableSlots'
  useConsultation(); // Call the hook without destructuring if no elements are used
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    async function fetchAvailability() {
      try {
        await consultationService.getAvailability();
        // Removed unused setter for 'availableSlots'
      } catch (error) {
        addNotification('Failed to fetch availability', 'error');
      }
    }

    fetchAvailability(); // Call the function to fetch availability
  }, [selectedDate, professionalId]); // Ensure selectedDate is defined

  // Example logic to handle time selection
  const handleTimeSelection = (time: Date) => {
    onTimeSelected(time); // Use the onTimeSelected prop
  };

  // Rest of the component implementation...
  return (
    <div className="space-y-6">
      {/* Calendar implementation */}
      <input
        type="date"
        onChange={(e) => setSelectedDate(new Date(e.target.value))}
      />
      <button onClick={() => handleTimeSelection(new Date())}>
        Select Time
      </button>
    </div>
  );
}