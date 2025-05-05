import ConsultationForm from '@/components/consultation/ConsultationForm';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function ConsultationPage() {
  const navigate = useNavigate();

  return (
    <main className="py-10 px-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Book a Consultation</h1>
      <ConsultationForm 
        onSubmit={(data) => {
          console.log('Form submitted:', data);
          toast.success('Consultation booked! A confirmation email will be sent shortly.');
          navigate('/client/consultations');
        }} 
        onCancel={() => {
          console.log('Form cancelled');
          navigate('/client/consultations');
        }} 
      />
    </main>
  );
}