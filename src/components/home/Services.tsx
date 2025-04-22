import React from 'react';

export interface ServicesProps {
  onBookNow: (serviceType: string) => void;
}

export interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceType: string;
}

export default function Services({ onBookNow }: ServicesProps) {
  // Assuming this is the Services component; since original code was BookingModal,
  // the following is a placeholder for the Services component implementation.
  // Replace 'yourServiceIdentifier' with actual service types as needed.

  return (
    <div>
      <button onClick={() => onBookNow('serviceType1')}>Book Now</button>
      <button onClick={() => onBookNow('serviceType2')}>Book Now</button>
      {/* Add more buttons as needed */}
    </div>
  );
}

export function BookingModal({
  isOpen,
  onClose,
  serviceType,
}: BookingModalProps) {
  if (!isOpen) return null;
  

  // Rest of the component implementation uses onClose and serviceType accordingly
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={onClose} className="close-button">Close</button>
        <h2>Book Service: {serviceType}</h2>
        {/* Additional modal content */}
      </div>
    </div>
  );
}