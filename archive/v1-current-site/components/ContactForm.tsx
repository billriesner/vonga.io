'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface ContactFormProps {
  className?: string;
}

export function ContactForm({ className = '' }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      company: formData.get('company') as string,
      message: formData.get('message') as string,
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        (e.target as HTMLFormElement).reset();
      } else {
        setSubmitStatus('error');
        setErrorMessage(result.error || 'Failed to submit form');
      }
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div style={{ marginBottom: '24px' }}>
        <label htmlFor="name" className="block text-sm font-semibold mb-sm" style={{ color: '#FFFFFF' }}>
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          className="w-full px-lg py-md border-2 border-muted rounded focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-navy bg-white"
          placeholder="Your name"
          required
          disabled={isSubmitting}
        />
      </div>
      
      <div style={{ marginBottom: '24px' }}>
        <label htmlFor="email" className="block text-sm font-semibold mb-sm" style={{ color: '#FFFFFF' }}>
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className="w-full px-lg py-md border-2 border-muted rounded focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-navy bg-white"
          placeholder="your@email.com"
          required
          disabled={isSubmitting}
        />
      </div>
      
      <div style={{ marginBottom: '24px' }}>
        <label htmlFor="company" className="block text-sm font-semibold mb-sm" style={{ color: '#FFFFFF' }}>
          Company/Organization
        </label>
        <input
          type="text"
          id="company"
          name="company"
          className="w-full px-lg py-md border-2 border-muted rounded focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-navy bg-white"
          placeholder="Your organization"
          required
          disabled={isSubmitting}
        />
      </div>
      
      <div style={{ marginBottom: '24px' }}>
        <label htmlFor="message" className="block text-sm font-semibold mb-sm" style={{ color: '#FFFFFF' }}>
          Tell us about your project
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className="w-full px-lg py-md border-2 border-muted rounded focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-navy bg-white"
          placeholder="What are you looking to create?"
          required
          disabled={isSubmitting}
        />
      </div>

      {submitStatus === 'success' && (
        <div className="mb-lg p-md rounded" style={{ backgroundColor: '#33BECC', color: '#FFFFFF' }}>
          <p className="text-sm font-semibold">Thanks! We'll be in touch soon.</p>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="mb-lg p-md rounded" style={{ backgroundColor: '#EF4444', color: '#FFFFFF' }}>
          <p className="text-sm font-semibold">{errorMessage}</p>
        </div>
      )}

      <Button 
        type="submit" 
        className="w-full bg-gray-200 hover:bg-gray-300 text-black font-semibold shadow-md" 
        size="lg"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Sending...' : 'Schedule a Call'}
      </Button>
    </form>
  );
}

