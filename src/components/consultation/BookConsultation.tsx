import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Video, MapPin } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { useConsultation } from '../../hooks/useConsultation';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

export function BookConsultation() {
  const navigate = useNavigate();
  const { isScheduling, scheduleConsultation } = useConsultation();
  const { user } = useAuth(); // Assuming you have access to user.id here
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const rawData = Object.fromEntries(formData);

    if (!rawData.type || !rawData.date || !rawData.time) {
      toast.error('Please fill in all required fields: type, date, and time.');
      setIsLoading(false);
      return;
    }

    try {
      const startTime = new Date(`${rawData.date}T${rawData.time}`);
      const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // +1 hour by default

      const booking = await scheduleConsultation({
        type: rawData.type,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        notes: rawData.notes,
        is_virtual: rawData.is_virtual === 'true',
        client_id: user?.id,
        assigned_professional_id: 'placeholder-professional-id'
      });

      console.log('Booking result:', booking);

      await fetch('/.netlify/functions/sendConfirmationEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user?.email,
          consultationType: rawData.type,
          date: `${rawData.date} ${rawData.time}`
        })
      });
      toast.success('Consultation booked! A confirmation email will be sent.');

      navigate('confirmation');
    } catch (error) {
      console.error('Error scheduling consultation:', error);
      toast.error('Something went wrong while booking. Please try again.');
    } finally {
      setIsLoading(false);
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

          <div className="flex flex-col space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Meeting Type
            </label>
            <div className="flex items-center space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="is_virtual"
                  value="true"
                  defaultChecked
                  className="form-radio text-blue-600"
                />
                <span className="ml-2 flex items-center">
                  <Video className="h-4 w-4 mr-1" />
                  Virtual
                </span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="is_virtual"
                  value="false"
                  className="form-radio text-blue-600"
                />
                <span className="ml-2 flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  In-Person
                </span>
              </label>
            </div>
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
              disabled={isScheduling || isLoading}
            >
              {isLoading ? 'Scheduling...' : 'Schedule Consultation'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BookConsultation;