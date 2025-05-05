import ConsultationForm from '@/components/consultation/ConsultationForm';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import { toast } from 'react-toastify';



// Define and export ConsultationFormData if it doesn't already exist
export type ConsultationFormData = {
  type: string;
  startTime: string;
  endTime?: string;
  notes?: string;
};
interface ConsultationFormProps {
  onSubmit: (data: ConsultationFormData) => void;
  onCancel: () => void;
  professionals?: { id: string; name: string }[];
}
function ConsultationFormComponent({ onSubmit, onCancel, professionals }: ConsultationFormProps) {
  return (
    <div>
      {/* Add your form implementation here */}
      <h2>Consultation Form</h2>
      {/* Example: */}
      {/* <form onSubmit={...}>...</form> */}
    </div>
  );
}

export default function ConsultationPage() {
  const navigate = useNavigate();

  return (
    <main className="py-10 px-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Book a Consultation</h1>

      <ConsultationFormComponent
        onSubmit={async (data: ConsultationFormData) => {
          try {
            await fetch('/.netlify/functions/scheduleConsultation', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data),
            });
            toast.success('Your consultation has been scheduled!');
            navigate('/client/consultation/confirmation');
          } catch (error) {
            console.error('Error scheduling consultation:', error);
            toast.error('Failed to schedule consultation.');
          }
        }}
        onCancel={() => navigate(-1)}
        professionals={[]}
        // Pass the professionals prop if needed
        // You can fetch the professionals from your API or context
        // and pass them here
        // Example: professionals={await fetchProfessionals()}
        // or use a hardcoded array for testing
        // professionals={[{ id: '1', name: 'John Doe' }, { id: '2', name: 'Jane Smith' }]}
        // Ensure the professionals prop is passed correctly
        // professionals={professionals} // Uncomment if you have professionals data
        // onSubmit={handleBooking} // Uncomment if you have a booking handler
        // onCancel={handleCancel} // Uncomment if you have a cancel handler
        // onSubmit={handleBooking} // Uncomment if you have a booking handler
      />
    </main>
  );
}