import React from 'react';

interface ConsultationFormData {
  professionalId: string;
  date: string;
  time: string;
  type: string;
  notes: string;
  startTime?: string;
  endTime?: string;
}

interface ImportedConsultationFormProps {
  onSubmit: (data: ConsultationFormData & { clientId?: string }) => void;
  onCancel: () => void;
  professionals?: { id: string; name: string }[];
}

export default function ImportedConsultationForm({
  onSubmit,
  onCancel,
  professionals = []
}: ImportedConsultationFormProps) {
  // form logic here
}
