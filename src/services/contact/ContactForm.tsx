import React, { useState } from 'react';
import { submitContactForm } from '@/services/contact/submitContact';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await submitContactForm({ name, email, message });
    if (success) {
      alert("Thank you! We received your message.");
      setName('');
      setEmail('');
      setMessage('');
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