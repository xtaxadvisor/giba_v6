import React, { useState } from 'react';
import { submitContactForm } from '@/services/contact/submitContact';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await submitContactForm({ name, email, message });
    if (result.success) {
      alert("Thank you! We received your message.");
      setName('');
      setEmail('');
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required />
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" required />
      <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Your message" required />
      <button type="submit">Send Message</button>
    </form>
  );
}