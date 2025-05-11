import { useQuery, useMutation, UseMutationResult } from '@tanstack/react-query';
import { consultationService } from '../services/api/consultationService';
import { useAuth } from '@/contexts/AuthContext';
import type { Consultation } from '@/types'; // Update path to match the correct Consultation type
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export function useConsultation(consultationId?: string) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const scheduleMutation = useMutation<Consultation, Error, any>({
    mutationFn: async (data: any) => {
      const result = await consultationService.create(data);
      return result as Consultation; // Ensure type compatibility
    },
    onSuccess: (consultation) => {
      toast.success('Consultation scheduled. A confirmation email will be sent.');
      fetch('/.netlify/functions/sendConfirmationEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: consultation?.client_email, // Replace 'client_email' with the correct property from the Consultation type
          consultationType: consultation?.consultation_type,
          date: consultation?.consultation_date
        })
      });
      navigate('/client/consultations/confirmation');
    },
  });

  const updateMutation = useMutation<void, Error, { id: string; [key: string]: any }>({
    mutationFn: async (data) => {
      await consultationService.update(data.id, data);
    },
  }) as UseMutationResult<void, Error, { id: string; [key: string]: any }>;

  const consultationQuery = useQuery<Consultation | null, Error>({
    queryKey: ['consultation', consultationId],
    queryFn: async () => {
      if (!consultationId) return null;
      return await consultationService.getById(consultationId) as import('@/types').Consultation | null;
    },
    enabled: !!consultationId,
  });
  // Removed invalid `declare` keyword
  // Removed unused consultationResult to fix the error
  const hasAccess =
    consultationQuery.data &&
    user &&
    (
      ['professional', 'client', 'student', 'investor', 'admin'].includes(user.role ?? '') ||
      consultationQuery.data.clientId === user.id ||
      consultationQuery.data.professionalId === user.id
    );

  return {
    consultation: hasAccess ? consultationQuery.data : null,
    isLoading: consultationQuery.isLoading,
    scheduleConsultation: scheduleMutation.mutateAsync,
    updateConsultation: updateMutation.mutate,
    isScheduling: scheduleMutation.isPending,
  };
}