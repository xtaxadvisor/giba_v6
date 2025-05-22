import React, { useState } from 'react';
import { submitContactForm } from '@/services/contact/submitContact';
import { supabase } from '@/lib/supabase/client';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const success = await submitContactForm({ name, email, message });
    if (!success) throw new Error("Form submission failed");

    const response = await fetch("https://asdthnxphqjpxzyhpylr.functions.supabase.co/send-email", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: email,
        cc: ['admin@protaxadvisors.tax'],
        subject: 'We received your message!',
        html: `<p>Hi ${name},</p><p>Thanks for reaching out to ProTaxAdvisors. One of our experts will follow up with you soon.</p>`,
      }),
    });

    const logStatus = response.ok ? 'sent' : 'error';

    await supabase.from('email_logs').insert({
      recipient: email,
      cc: 'admin@protaxadvisors.tax',
      subject: 'We received your message!',
      sent_at: new Date().toISOString(),
      context: 'contact_form',
      status: logStatus,
      ip_address: window?.location?.hostname || 'unknown'
    });

    await supabase.from('messages').insert({
      name,
      email,
      message,
      status: 'new',
      assigned_to: 'admin@protaxadvisors.tax',
      received_at: new Date().toISOString(),
      context: 'contact_form'
    });

    alert("Thank you! We received your message.");
    setName('');
    setEmail('');
    setMessage('');
  } catch (err) {
    console.error("❌ Contact form error:", err);
    alert("Something went wrong. Please try again later.");
  }
};

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        autoComplete="name"
        aria-label="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        required
      />
      <input
        type="email"
        name="email"
        autoComplete="email"
        aria-label="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        required
      />
      <textarea
        name="message"
        autoComplete="off"
        aria-label="Your message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Your message"
        required
      />
      <button type="submit">Send Message</button>
    </form>
  );
}