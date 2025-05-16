

import { supabase } from '@/lib/supabase/client';
import { emailService } from '@/services/communication/email';

export async function submitContactForm({
  name,
  email,
  message
}: {
  name: string;
  email: string;
  message: string;
}): Promise<boolean> {
  try {
    const { error } = await supabase.from('messages').insert({
      content: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      created_at: new Date().toISOString()
    });

    if (error) {
      console.error('❌ Failed to insert contact message:', error.message);
      return false;
    }

    console.log('✅ Contact message saved to Supabase');

    await emailService.sendUserConfirmation(name, email);
    return true;
  } catch (error) {
    console.error('❌ Unexpected error during contact submission:', error);
    return false;
  }
}