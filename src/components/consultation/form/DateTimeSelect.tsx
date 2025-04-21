import { Calendar, Clock } from 'lucide-react';
import { Input } from '../../ui/Input';

interface DateTimeSelectProps {
  type: string;
  date: string;
  time: string;
  onTypeChange: (type: string) => void;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
}

export function DateTimeSelect({
  type,
  date,
  time,
  onTypeChange,
  onDateChange,
  onTimeChange
}: DateTimeSelectProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div className="mb-4">
        <label htmlFor="consultation-type" className="block text-sm font-medium text-gray-700 mb-1">Consultation Type</label>
        <select
          id="consultation-type"
          aria-label="Consultation Type"
          value={type}
          onChange={(e) => onTypeChange(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        >
          <option value="" disabled>Select a type</option>
          <option value="tax-planning">Tax Planning</option>
          <option value="itin">ITIN Application</option>
          <option value="business-structuring">Business Structuring</option>
          <option value="general">General Consultation</option>
        </select>
      </div>
      <Input
        type="date"
        label="Date"
        icon={Calendar}
        value={date}
        onChange={(e) => onDateChange(e.target.value)}
        required
        min={new Date().toISOString().split('T')[0]}
      />
      <Input
        type="time"
        label="Time"
        icon={Clock}
        value={time}
        onChange={(e) => onTimeChange(e.target.value)}
        required
      />
    </div>
  );
}