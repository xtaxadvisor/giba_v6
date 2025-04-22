import { Routes, Route } from 'react-router-dom';
import ConfirmationPage from '@/components/consultation/ConfirmationPage';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceType: string;
}

// Removed duplicate declaration of BookingModal
interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceType: string;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, serviceType }) => {
  if (!isOpen) return null;

  return (
    <div>
      {/* Modal content */}
      <p>Service Type: {serviceType}</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
}

export default BookingModal;