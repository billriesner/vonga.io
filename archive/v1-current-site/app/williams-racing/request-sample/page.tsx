'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import SEO from '@/components/SEO';
import Link from 'next/link';

export default function RequestSamplePage() {
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
      phone: formData.get('phone') as string,
      organization: formData.get('organization') as string,
      size: formData.get('size') as string,
      street: formData.get('street') as string,
      city: formData.get('city') as string,
      state: formData.get('state') as string,
      zip: formData.get('zip') as string,
      country: formData.get('country') as string,
      notes: formData.get('notes') as string,
    };

    try {
      const response = await fetch('/api/williams-racing/sample-request', {
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
        setErrorMessage(result.error || 'Failed to submit request');
      }
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const crumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.vonga.com/" },
      { "@type": "ListItem", position: 2, name: "Williams Racing", item: "https://www.vonga.com/williams-racing" },
      { "@type": "ListItem", position: 3, name: "Request a Sample", item: "https://www.vonga.com/williams-racing/request-sample" },
    ],
  };

  if (submitStatus === 'success') {
    return (
      <>
        <SEO pathname="/williams-racing/request-sample" jsonLd={crumbs} />
        <div className="bg-[#0F172A] text-white min-h-screen py-24 md:py-32">
          <div className="max-w-2xl mx-auto px-6 md:px-10">
            <div className="bg-white/5 rounded-3xl border border-white/10 p-8 md:p-12 text-center space-y-6">
              <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center bg-gradient-to-br from-[#00A0E1] to-[#33BECC]">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">Request Received!</h1>
              <p className="text-xl text-white/80 leading-relaxed">
                We've received your sample request. We'll send a Vonga sample with pre-loaded Williams experience to the address you provided.
              </p>
              <p className="text-white/60">
                You should receive a confirmation email shortly. We'll be in touch soon!
              </p>
              <div className="pt-6">
                <Link href="/williams-racing">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-[#00A0E1] to-[#33BECC] hover:from-[#00A0E1]/90 hover:to-[#33BECC]/90 text-white border-0 px-8 py-6 text-lg font-semibold"
                  >
                    Back to Williams Racing
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO pathname="/williams-racing/request-sample" jsonLd={crumbs} />
      <div className="bg-[#0F172A] text-white min-h-screen py-16 md:py-24">
        <div className="max-w-2xl mx-auto px-6 md:px-10">
          <div className="mb-8">
            <Link href="/williams-racing" className="text-[#33BECC] hover:text-[#00A0E1] transition-colors inline-flex items-center gap-2 mb-4">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Williams Racing
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-[#00A0E1] bg-clip-text text-transparent">
              Request a Sample
            </h1>
            <p className="text-xl text-white/80">
              Let us know where we can send a sample so you can experience this for yourself.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 bg-white/5 rounded-2xl border border-white/10 p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-white/80 mb-2 font-medium">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 px-4 py-3 outline-none focus:ring-2 focus:ring-[#33BECC]/40 focus:border-[#33BECC]"
                  placeholder="Jane Smith"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-white/80 mb-2 font-medium">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 px-4 py-3 outline-none focus:ring-2 focus:ring-[#33BECC]/40 focus:border-[#33BECC]"
                  placeholder="jane@team.com"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="phone" className="block text-white/80 mb-2 font-medium">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-full rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 px-4 py-3 outline-none focus:ring-2 focus:ring-[#33BECC]/40 focus:border-[#33BECC]"
                  placeholder="+1 (555) 123-4567"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label htmlFor="organization" className="block text-white/80 mb-2 font-medium">Organization *</label>
                <input
                  type="text"
                  id="organization"
                  name="organization"
                  required
                  className="w-full rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 px-4 py-3 outline-none focus:ring-2 focus:ring-[#33BECC]/40 focus:border-[#33BECC]"
                  placeholder="Williams Racing"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div>
              <label htmlFor="size" className="block text-white/80 mb-2 font-medium">T-shirt Size *</label>
              <select
                id="size"
                name="size"
                required
                className="w-full rounded-xl bg-white/5 border border-white/10 text-white px-4 py-3 outline-none focus:ring-2 focus:ring-[#33BECC]/40 focus:border-[#33BECC]"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: 'white'
                }}
                disabled={isSubmitting}
              >
                <option value="" disabled style={{ backgroundColor: '#0F172A', color: 'white' }}>
                  Select t-shirt size
                </option>
                <option value="S" style={{ backgroundColor: '#0F172A', color: 'white' }}>S</option>
                <option value="M" style={{ backgroundColor: '#0F172A', color: 'white' }}>M</option>
                <option value="L" style={{ backgroundColor: '#0F172A', color: 'white' }}>L</option>
                <option value="XL" style={{ backgroundColor: '#0F172A', color: 'white' }}>XL</option>
                <option value="2XL" style={{ backgroundColor: '#0F172A', color: 'white' }}>2XL</option>
              </select>
            </div>

            <div>
              <label htmlFor="street" className="block text-white/80 mb-2 font-medium">Street Address *</label>
              <input
                type="text"
                id="street"
                name="street"
                required
                className="w-full rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 px-4 py-3 outline-none focus:ring-2 focus:ring-[#33BECC]/40 focus:border-[#33BECC]"
                placeholder="Street address, building number, apartment/unit"
                disabled={isSubmitting}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label htmlFor="city" className="block text-white/80 mb-2 font-medium">City *</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  required
                  className="w-full rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 px-4 py-3 outline-none focus:ring-2 focus:ring-[#33BECC]/40 focus:border-[#33BECC]"
                  placeholder="City"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label htmlFor="state" className="block text-white/80 mb-2 font-medium">
                  State/Province <span className="text-white/50 text-sm font-normal">(if applicable)</span>
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  className="w-full rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 px-4 py-3 outline-none focus:ring-2 focus:ring-[#33BECC]/40 focus:border-[#33BECC]"
                  placeholder="State/Province"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="zip" className="block text-white/80 mb-2 font-medium">ZIP/Postal Code *</label>
                <input
                  type="text"
                  id="zip"
                  name="zip"
                  required
                  className="w-full rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 px-4 py-3 outline-none focus:ring-2 focus:ring-[#33BECC]/40 focus:border-[#33BECC]"
                  placeholder="Postal code"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label htmlFor="country" className="block text-white/80 mb-2 font-medium">Country *</label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  required
                  className="w-full rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 px-4 py-3 outline-none focus:ring-2 focus:ring-[#33BECC]/40 focus:border-[#33BECC]"
                  placeholder="Country"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div>
              <label htmlFor="notes" className="block text-white/80 mb-2 font-medium">Additional Notes</label>
              <textarea
                id="notes"
                name="notes"
                rows={4}
                className="w-full rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 px-4 py-3 outline-none focus:ring-2 focus:ring-[#33BECC]/40 focus:border-[#33BECC] resize-none"
                placeholder="Any special instructions or questions..."
                disabled={isSubmitting}
              />
            </div>

            {submitStatus === 'error' && (
              <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-red-400">Submission Error</h3>
                    <p className="text-red-300 text-sm mt-1">{errorMessage}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-center pt-4">
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-[#00A0E1] to-[#33BECC] hover:from-[#00A0E1]/90 hover:to-[#33BECC]/90 text-white border-0 px-10 py-6 text-lg font-semibold shadow-lg shadow-[#00A0E1]/20"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
