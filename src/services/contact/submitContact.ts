import { supabase } from '../../lib/supabase/client';
// Removed incorrect import as EmailService is defined locally in this file

// Removed duplicate EmailService definition

export class EmailService {
  // Existing methods
  async sendUserConfirmation(name: string, email: string): Promise<void> {
    console.log(`Sending confirmation email to ${name} at ${email}`);
    // Add actual email sending logic here
  }
}

const emailService = new EmailService();



export async function submitContactForm({
  name,
  email,
  message
}: {
  name: string;
  email: string;
  message: string;
}) {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      content: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      created_at: new Date().toISOString()
    });

  if (error) {
    console.error('❌ Failed to insert contact message:', error.message);
    return { success: false, error };
  }

  console.log('✅ Contact message saved:', data);
  await emailService.sendUserConfirmation(name, email); // Ensure the method exists in EmailService
  return { success: true };
}



 
