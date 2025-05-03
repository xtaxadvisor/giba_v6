import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, FileText, Video } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { useAuth } from '../../contexts/AuthContext';

interface ConsultationFormData {
  professionalId: string;
  date: string;
  time: string;
  type: string;
  notes: string;
  startTime?: string;
  endTime?: string;
}

interface ConsultationFormProps {
  onSubmit: (data: ConsultationFormData & { clientId?: string }) => void;
  onCancel: () => void;
  professionals?: Array<{ id: string; name: string }>;
}

export default function ConsultationForm({ onSubmit, onCancel, professionals }: ConsultationFormProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ConsultationFormData>({
    professionalId: '',
    date: '',
    time: '',
    type: 'tax-planning',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.date) {
      toast.error("Please select a date before submitting.");
      setLoading(false);
      return;
    }

    const startTime = new Date(`${formData.date}T${formData.time}`);
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1 hour duration

    try {
      await navigator.locks.request('consultation-lock', { mode: 'exclusive' }, async () => {
        await onSubmit({
          clientId: user?.id,
          professionalId: formData.professionalId,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          type: formData.type,
          notes: formData.notes,
          date: '',
          time: ''
        });
      });
      setFormData({
        professionalId: '',
        date: '',
        time: '',
        type: 'tax-planning',
        notes: ''
      });
      // Display a success notification (update this logic if needed)
      toast.success('Consultation scheduled successfully!');
      toast.info('You will receive a confirmation email with the meeting details.');
      navigate('/client/consultation/confirmation');
    } catch (err) {
      if (err instanceof Error && err.name === 'NavigatorLockAcquireTimeoutError') {
        console.warn('Could not acquire navigator lock. Another process may already be using it.');
      } else {
        console.error('Unexpected error while acquiring lock:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Select
        label="Consultation Type"
        options={[
          { value: 'tax-planning', label: 'Tax Planning' },
          { value: 'financial-review', label: 'Financial Review' },
          { value: 'investment-advisory', label: 'Investment Advisory' },
          { value: 'general', label: 'General Consultation' }
        ]}
        value={formData.type}
        onChange={(value) => setFormData({ ...formData, type: value })}
        required
      />

      {professionals && (
        <Select
          label="Select Professional"
          options={professionals.map(p => ({ value: p.id, label: p.name }))}
          value={formData.professionalId}
          onChange={(value) => setFormData({ ...formData, professionalId: value })}
          required
        />
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Input
          type="date"
          label="Date"
          icon={Calendar}
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
          min={new Date().toISOString().split('T')[0]}
        />

        <Input
          type="time"
          label="Time"
          icon={Clock}
          value={formData.time}
          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
          required
        />
      </div>

      <Input
        label="Additional Notes"
        icon={FileText}
        value={formData.notes}
        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        multiline
        rows={4}
        placeholder="Any specific topics you'd like to discuss?"
      />

      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-center">
          <Video className="h-5 w-5 text-blue-500 mr-2" />
          <p className="text-sm text-blue-700">
            Virtual consultation will be conducted via secure video conferencing.
            Meeting link will be sent to your email after scheduling.
          </p>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? 'Scheduling...' : 'Schedule Consultation'}
        </Button>
      </div>
    </form>
  );
}