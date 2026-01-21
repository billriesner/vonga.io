'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface QuickContactFormProps {
  className?: string;
}

export function QuickContactForm({ className = '' }: QuickContactFormProps) {
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
      message: 'Quick contact from homepage',
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
      <input
        type="text"
        name="name"
        placeholder="Name"
        className="w-full px-lg py-md border-2 border-muted rounded focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-text bg-white placeholder:text-text/60"
        style={{ marginBottom: '24px' }}
        required
        disabled={isSubmitting}
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        className="w-full px-lg py-md border-2 border-muted rounded focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-text bg-white placeholder:text-text/60"
        style={{ marginBottom: '24px' }}
        required
        disabled={isSubmitting}
      />
      <input
        type="text"
        name="company"
        placeholder="Company"
        className="w-full px-lg py-md border-2 border-muted rounded focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-text bg-white placeholder:text-text/60"
        style={{ marginBottom: '24px' }}
        required
        disabled={isSubmitting}
      />

      {submitStatus === 'success' && (
        <div className="mb-lg p-md rounded" style={{ backgroundColor: '#33BECC', color: '#FFFFFF', marginBottom: '24px' }}>
          <p className="text-sm font-semibold">Thanks! We'll be in touch soon.</p>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="mb-lg p-md rounded" style={{ backgroundColor: '#EF4444', color: '#FFFFFF', marginBottom: '24px' }}>
          <p className="text-sm font-semibold">{errorMessage}</p>
        </div>
      )}

      <Button 
        type="submit" 
        className="w-full bg-gray-200 hover:bg-gray-300 text-black font-semibold shadow-md"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Sending...' : 'Schedule a Call'}
      </Button>
    </form>
  );
}

