import { toast } from 'react-toastify';
import { ConsultationCard } from '../ConsultationCard';
import type { Consultation } from '../../../services/api/consultationService';

interface ConsultationGroupProps {
  title: string;
  consultations: Consultation[];
  onJoin?: (consultation: Consultation) => void;
  onCancel?: (consultation: Consultation) => void;
  onReschedule?: (consultation: Consultation) => void;
}

export function ConsultationGroup({
  title,
  consultations,
  onJoin,
  onCancel,
  onReschedule
}: ConsultationGroupProps) {
  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-4">{title}</h2>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {consultations.map(consultation => (
          <ConsultationCard
            key={consultation.id}
            consultation={consultation}
            onJoin={onJoin ? () => {
              toast.info('Redirecting to your consultation room...');
              onJoin(consultation);
            } : undefined}
            onCancel={onCancel ? () => onCancel(consultation) : undefined}
            onReschedule={onReschedule ? () => onReschedule(consultation) : undefined}
          />
        ))}
      </div>
    </div>
  );
}