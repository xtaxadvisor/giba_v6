import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export function ConsultationList() {
  const navigate = useNavigate();
  const handleConsultationClick = (consultationId: string) => {
    navigate(`/client/consultations/${consultationId}`);
  };
  
  // TODO: replace mock data with real fetch when Supabase is connected
  const consultations = [
    {
      id: '1',
      title: 'Tax Planning',
      description: 'Discuss tax reduction strategies',
      date: '2025-04-22T14:00:00Z',
    },
    {
      id: '2',
      title: 'Business Structuring',
      description: 'Entity formation and compliance',
      date: '2025-04-23T10:30:00Z',
    },
  ];

  if (consultations.length === 0) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Your Consultations</h2>
          <Link to="book">
            <Button variant="primary">Book Consultation</Button>
          </Link>
        </div>
        <div>No consultations found</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Your Consultations</h2>
        <Link to="book">
          <Button variant="primary">Book Consultation</Button>
        </Link>
      </div>
      <ul className="space-y-4">
        {consultations.map((c) => (
          <li
            key={c.id}
            className="p-4 border rounded hover:bg-gray-50 cursor-pointer"
            onClick={() => handleConsultationClick(c.id)}
          >
            <h3 className="text-lg font-medium">{c.title}</h3>
            <p className="text-gray-600">{c.description}</p>
            <p className="text-sm text-gray-500">
              {new Date(c.date).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}