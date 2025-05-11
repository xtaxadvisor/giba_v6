import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext'; // ✅
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export function ConsultationList() {
  const navigate = useNavigate();

  const { user } = useAuth();
  const [consultations, setConsultations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  async function loadConsultations() {
    const { data, error } = await supabase
      .from('consultations')
      .select('id, consultation_date, consultation_time')
      .eq('user_id', user?.id || '')
      .order('consultation_date', { ascending: false });

    if (error) {
      console.error('Error fetching consultations:', JSON.stringify(error, null, 2));
    } else {
      setConsultations(data || []);
    }
    setLoading(false);
  }

  if (user?.id) {
    loadConsultations();
  }
  }, [user?.id]);

  if (loading) {
    return <p>Loading consultations…</p>;
  }

  const handleConsultationClick = (consultationId: string) => {
    navigate(`/client/consultations/${consultationId}`);
  };
  

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
            <h3 className="text-lg font-medium">{c.description}</h3>
            <p className="text-gray-600">{c.description}</p>
            <p className="text-sm text-gray-500">
            {new Date(c.consultation_date).toLocaleDateString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}