// netlify/functions/consultations.ts

import { Handler } from '@netlify/functions';

// A stubbed example—you can replace this with a real Supabase call later
const mockConsultations = [
  { id: '1', consultation_date: '2025-04-22T14:00:00Z', consultation_type: 'Tax Planning', notes: '' },
  { id: '2', consultation_date: '2025-04-23T10:30:00Z', consultation_type: 'Business Structuring', notes: '' },
];

export const handler: Handler = async () => {
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(mockConsultations),
  };
};