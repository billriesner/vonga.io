'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface SubscribeFormProps {
  className?: string;
}

export function SubscribeForm({ className = '' }: SubscribeFormProps) {
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
      email: formData.get('email') as string,
    };

    try {
      const response = await fetch('/api/subscribe', {
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
        setErrorMessage(result.error || 'Failed to subscribe');
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
        type="email"
        name="email"
        placeholder="Enter your email"
        className="w-full px-lg py-md border-2 border-muted rounded focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-text bg-white"
        style={{ marginBottom: '24px' }}
        required
        disabled={isSubmitting}
      />

      {submitStatus === 'success' && (
        <div className="mb-lg p-md rounded" style={{ backgroundColor: '#33BECC', color: '#FFFFFF', marginBottom: '24px' }}>
          <p className="text-sm font-semibold">Thanks for subscribing!</p>
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
        {isSubmitting ? 'Subscribing...' : 'Subscribe'}
      </Button>
    </form>
  );
}
