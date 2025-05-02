import { Handler } from '@netlify/functions';
import { supabase } from '../../src/lib/supabase/client';
import { randomUUID } from 'crypto';
import { emailService } from '../../src/services/email/emailService';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: '',
    };
  }

  if (event.httpMethod === 'GET') {
    const { data, error } = await supabase
      .from('consultations')
      .select('*');

    if (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
        headers: corsHeaders,
      };
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(data),
    };
  }

  if (event.httpMethod === 'POST') {
    try {
      const body = JSON.parse(event.body || '{}');
      const { consultationType, selectedDate, notes } = body;

      if (!consultationType || !selectedDate) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Missing required fields' }),
          headers: corsHeaders,
        };
      }

      const { data: inserted, error } = await supabase
        .from('consultations')
        .insert([
          {
            id: randomUUID(),
            consultation_type: consultationType,
            consultation_date: selectedDate,
            notes: notes || '',
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .maybeSingle();

      if (error) {
        return {
          statusCode: 500,
          body: JSON.stringify({ error: 'Database insert failed', detail: error.message }),
          headers: corsHeaders,
        };
      }

      // Fetch client email
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', inserted.client_id)
        .maybeSingle();

      if (!profileError && profile?.email) {
        try {
          await emailService.sendBookingConfirmation(profile.email, {
            consultationType: inserted.consultation_type,
            date: inserted.consultation_date,
            notes: inserted.notes || '',
          });
        } catch (emailError) {
          console.error('Email sending failed:', emailError);
        }
      }

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          message: 'Consultation created successfully',
          data: inserted,
        }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to process consultation' }),
        headers: corsHeaders,
      };
    }
  }

  return {
    statusCode: 405,
    body: JSON.stringify({ error: 'Method Not Allowed' }),
    headers: corsHeaders,
  };
};

export { handler };