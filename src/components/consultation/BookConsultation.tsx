import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Video } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { useConsultation } from '../../hooks/useConsultation';

// Removed duplicate function to avoid conflict
export function BookConsultation() {
  const navigate = useNavigate();
  const { isScheduling, scheduleConsultation } = useConsultation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement); 
    const data = Object.fromEntries(formData);
    try {
      // Assuming you have a function to handle the scheduling
      await scheduleConsultation(data);
      navigate('confirmation');
    }
    catch (error) {
      console.error('Error scheduling consultation:', error);
      // Handle error (e.g., show notification)
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Book a Consultation
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Select
            name="type"
            label="Consultation Type"
            options={[
              { value: 'tax-planning', label: 'Tax Planning' },
              { value: 'financial-review', label: 'Financial Review' },
              { value: 'investment-advisory', label: 'Investment Advisory' }
            ]}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              name="date"
              type="date"
              label="Date"
              icon={Calendar}
              required
            />
            <Input
              name="time"
              type="time"
              label="Time"
              icon={Clock}
              required
            />
          </div>

          <Input
            name="notes"
            label="Additional Notes"
            multiline
            rows={4}
            placeholder="Any specific topics you'd like to discuss?"
          />

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              icon={Video}
              disabled={isScheduling}
            >
              Schedule Consultation
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BookConsultation;