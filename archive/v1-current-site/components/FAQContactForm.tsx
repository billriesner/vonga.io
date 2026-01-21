'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface FAQContactFormProps {
  className?: string;
}

export function FAQContactForm({ className = '' }: FAQContactFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name, 
          email, 
          company: 'FAQ Submission', // Auto-fill company field
          message 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setSubmitStatus('error');
        setErrorMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
      setErrorMessage('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div style={{ marginBottom: '24px' }}>
        <label htmlFor="name" className="block text-sm font-semibold mb-sm" style={{ color: '#FFFFFF' }}>Name</label>
        <input
          type="text"
          id="name"
          className="w-full px-lg py-md border-2 border-muted rounded focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-navy bg-white"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={isSubmitting}
        />
      </div>
      <div style={{ marginBottom: '24px' }}>
        <label htmlFor="email" className="block text-sm font-semibold mb-sm" style={{ color: '#FFFFFF' }}>Email</label>
        <input
          type="email"
          id="email"
          className="w-full px-lg py-md border-2 border-muted rounded focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-navy bg-white"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isSubmitting}
        />
      </div>
      <div style={{ marginBottom: '24px' }}>
        <label htmlFor="message" className="block text-sm font-semibold mb-sm" style={{ color: '#FFFFFF' }}>How can we help you?</label>
        <textarea
          id="message"
          rows={4}
          className="w-full px-lg py-md border-2 border-muted rounded focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-navy bg-white"
          placeholder="Ask us anything..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          disabled={isSubmitting}
        />
      </div>
      <Button type="submit" className="w-full bg-gray-200 hover:bg-gray-300 text-black font-semibold shadow-md" size="lg" disabled={isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Submit Question'}
      </Button>
      {submitStatus === 'success' && (
        <p className="mt-md text-center font-semibold py-md px-lg rounded" style={{ backgroundColor: '#33BECC', color: '#FFFFFF' }}>
          Thanks! We'll get back to you soon.
        </p>
      )}
      {submitStatus === 'error' && (
        <p className="mt-md text-center text-error">{errorMessage}</p>
      )}
    </form>
  );
}

