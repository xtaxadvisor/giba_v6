import { Select } from '../../ui/Select';

// Component Props
interface ConsultationTypeSelectProps {
  value: string;
  onChange: (value: string) => void;
}

// Menu Item Interface (Used for sidebars, dropdowns, etc.)
export interface MenuItem {
  title: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

// Base Consultation Fields (Shared between different consultation structures)
interface BaseConsultation {
  id: number | string;
  type: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  startTime: string;
  endTime: string;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  clientAddress?: string;
  clientNotes?: string;
  isVirtual?: boolean;
  location?: string;
  meetingLink?: string;
}

// Simplified Consultation (Optional: can be removed if unused)
export interface consultation extends BaseConsultation {}

// Full Consultation including professional fields
export interface Consultation extends BaseConsultation {
  professionalId?: string;
  professionalName?: string;
  professionalEmail?: string;
  professionalPhone?: string;
  professionalAddress?: string;
  professionalNotes?: string;
}

// Consultation Type Model
export interface ConsultationType {
  id: number | string;
  name: string;
  description: string;
  duration: number;
  price: number;
  isVirtual: boolean;
  location?: string;
  meetingLink?: string;
}

// Select component for choosing consultation type
export function ConsultationTypeSelect({ value, onChange }: ConsultationTypeSelectProps) {
  const consultationTypes: { value: string; label: string }[] = [
    { value: 'tax-planning', label: 'Tax Planning' },
    { value: 'financial-review', label: 'Financial Review' },
    { value: 'investment-advisory', label: 'Investment Advisory' },
    { value: 'general', label: 'General Consultation' }
  ];

  const selectedValue = consultationTypes.find(opt => opt.value === value) ? value : consultationTypes[0].value;

  return (
    <Select
      label="Consultation Type"
      options={consultationTypes}
      value={selectedValue}
      onChange={onChange}
      required
    />
  );
}