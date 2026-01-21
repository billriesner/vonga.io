'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface ReturnFormProps {
  className?: string;
}

export function ReturnForm({ className = '' }: ReturnFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [items, setItems] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/returns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, orderNumber, items, reason }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setName('');
        setEmail('');
        setOrderNumber('');
        setItems('');
        setReason('');
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
        <label htmlFor="name" className="block text-sm font-semibold mb-sm text-black">Name</label>
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
        <label htmlFor="email" className="block text-sm font-semibold mb-sm text-black">Email</label>
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
        <label htmlFor="orderNumber" className="block text-sm font-semibold mb-sm text-black">Order Number</label>
        <input
          type="text"
          id="orderNumber"
          className="w-full px-lg py-md border-2 border-muted rounded focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-navy bg-white"
          placeholder="Your order number"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          required
          disabled={isSubmitting}
        />
      </div>
      <div style={{ marginBottom: '24px' }}>
        <label htmlFor="items" className="block text-sm font-semibold mb-sm text-black">Items to Return</label>
        <textarea
          id="items"
          rows={3}
          className="w-full px-lg py-md border-2 border-muted rounded focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-navy bg-white"
          placeholder="List the items you'd like to return"
          value={items}
          onChange={(e) => setItems(e.target.value)}
          required
          disabled={isSubmitting}
        />
      </div>
      <div style={{ marginBottom: '24px' }}>
        <label htmlFor="reason" className="block text-sm font-semibold mb-sm text-black">Reason for Return (Optional)</label>
        <textarea
          id="reason"
          rows={3}
          className="w-full px-lg py-md border-2 border-muted rounded focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-navy bg-white"
          placeholder="Let us know why you're returning these items"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          disabled={isSubmitting}
        />
      </div>
      <Button type="submit" className="w-full bg-gray-200 hover:bg-gray-300 text-black font-semibold shadow-md" size="lg" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit Return Request'}
      </Button>
      {submitStatus === 'success' && (
        <p className="mt-md text-center font-semibold py-md px-lg rounded" style={{ backgroundColor: '#33BECC', color: '#FFFFFF' }}>
          Return request submitted! We'll email you a prepaid return label shortly.
        </p>
      )}
      {submitStatus === 'error' && (
        <p className="mt-md text-center text-error">{errorMessage}</p>
      )}
    </form>
  );
}

