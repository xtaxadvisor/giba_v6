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
      console.error('Error fetching consultations:', error.message);
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
      const { consultationType, selectedDate, notes, assigned_professional_id } = body;

      if (!consultationType || !selectedDate) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Missing required fields: consultationType and selectedDate are required.' }),
          headers: corsHeaders,
        };
      }

      // Derive client_id from auth context
      let client_id: string | null = null;

      // Try to get client_id from the Authorization header (JWT)
      const authHeader = event.headers.authorization || event.headers.Authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        const { data: user, error: userError } = await supabase.auth.getUser(token);
        if (userError || !user) {
          console.error('Error retrieving user from token:', userError?.message);
        } else {
          client_id = user.user.id;
        }
      }

      if (!client_id) {
        return {
          statusCode: 401,
          body: JSON.stringify({ error: 'Unauthorized: client_id could not be determined from auth context.' }),
          headers: corsHeaders,
        };
      }

      const { data: inserted, error } = await supabase
        .from('consultations')
        .insert([
          {
            id: randomUUID(),
            consultation_type: consultationType,
            start_time: selectedDate,
            notes: notes || '',
            assigned_professional_id,
            client_id,
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .maybeSingle();

      if (error) {
        console.error('Database insert failed:', error.message);
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
        .eq('id', client_id)
        .maybeSingle();

      if (profileError) {
        console.error('Error fetching client profile:', profileError.message);
      }

      if (profile?.email) {
        try {
          await emailService.sendBookingConfirmation(profile.email, {
            consultationType: inserted.consultation_type,
            date: inserted.start_time,
            notes: inserted.notes || '',
          });
          console.log(`Booking confirmation email sent to ${profile.email}`);
        } catch (emailError) {
          console.error('Email sending failed:', emailError);
        }
      }

      // Add task for professional
      if (inserted.assigned_professional_id) {
        const { error: taskError } = await supabase.from('tasks').insert({
          user_id: inserted.assigned_professional_id,
          title: 'New Consultation Assigned',
          description: `Consultation: ${inserted.consultation_type}`,
          due_date: inserted.start_time,
          linked_consultation_id: inserted.id,
          status: 'pending',
          created_at: new Date().toISOString(),
        });
        if (taskError) {
          console.error('Error creating task for professional:', taskError.message);
        } else {
          console.log('Task created for professional:', inserted.assigned_professional_id);
        }
      }

      console.log('Consultation created successfully:', inserted.id);

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          message: 'Consultation created successfully',
          data: inserted,
        }),
      };
    } catch (error: any) {
      console.error('Failed to process consultation:', error.message);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to process consultation', detail: error.message }),
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