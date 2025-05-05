import { toast } from 'react-toastify';
import { Calendar, Clock, FileText, MessageSquare } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

function ConsultationDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <button
        onClick={() => {
          toast.info("Returning to consultation list...");
          navigate('/client/consultations');
        }}
        className="text-blue-600 hover:underline mb-4"
      >
        ← Back to Consultations
      </button>
      <p className="text-sm text-gray-500 mb-2">Consultation ID: {id}</p>
      <h1 className="text-2xl font-semibold mb-4">Consultation Details</h1>
      <Calendar className="h-5 w-5 mr-2" />
      {/* Other components and JSX */}
    </div>
  );
}

export default ConsultationDetail;