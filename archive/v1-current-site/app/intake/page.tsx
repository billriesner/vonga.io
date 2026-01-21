'use client';

import React, { useState } from 'react';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';

export default function IntakePage() {
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Get source from URL if available (for microsites)
  const [source] = useState(() => {
    if (typeof window !== 'undefined') {
      const referrer = document.referrer;
      if (referrer.includes('/indy-ignite')) return 'indy-ignite';
      // Add other microsite sources here as needed
    }
    return undefined;
  });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    const form = new FormData(e.currentTarget);
    const data = {
      name: form.get('name') as string,
      email: form.get('email') as string,
      organization: form.get('organization') as string || undefined,
      message: form.get('message') as string || undefined,
      source: source,
    };

    try {
      const response = await fetch('/api/contact-microsite', {
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
      setSubmitting(false);
    }
  }

  const crumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.vonga.com/" },
      { "@type": "ListItem", position: 2, name: "Let's Connect", item: "https://www.vonga.com/intake" },
    ],
  };

  if (submitStatus === 'success') {
    return (
      <>
        <SEO pathname="/intake" jsonLd={crumbs} />
        <div className="bg-[#0a1422] text-white min-h-screen py-16 md:py-24 flex items-center justify-center">
          <div className="max-w-xl mx-auto px-6 md:px-10 p-8 space-y-8 text-center bg-white/5 rounded-3xl border border-white/10">
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center" style={{ backgroundColor: '#33BECC' }}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-semibold text-white">Thanks for reaching out!</h2>
              <p className="text-white/80 text-lg">We&apos;ve received your message and will get back to you soon.</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO pathname="/intake" jsonLd={crumbs} />
      <div className="bg-[#0a1422] text-white min-h-screen py-16 md:py-24">
        <form onSubmit={onSubmit} className="max-w-2xl mx-auto space-y-6 px-6 md:px-10">
          <h1 className="text-3xl md:text-4xl font-semibold text-white mb-2">Let&apos;s Connect</h1>
          <p className="text-white/80 text-lg mb-8">Tell us about yourself and we&apos;ll get back to you soon.</p>
      
          <div>
            <label htmlFor="name" className="block text-white/80 mb-1 font-medium">Name *</label>
            <input 
              id="name" 
              name="name" 
              placeholder="Your name" 
              required 
              className="w-full rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 px-4 py-3 outline-none focus:ring-2 focus:ring-[#33BECC]/40 focus:border-[#33BECC]" 
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-white/80 mb-1 font-medium">Email *</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              placeholder="your@email.com" 
              required 
              className="w-full rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 px-4 py-3 outline-none focus:ring-2 focus:ring-[#33BECC]/40 focus:border-[#33BECC]" 
            />
          </div>

          <div>
            <label htmlFor="organization" className="block text-white/80 mb-1 font-medium">Organization</label>
            <input 
              id="organization" 
              name="organization" 
              placeholder="Your organization (optional)" 
              className="w-full rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 px-4 py-3 outline-none focus:ring-2 focus:ring-[#33BECC]/40 focus:border-[#33BECC]" 
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-white/80 mb-1 font-medium">Message</label>
            <textarea 
              id="message" 
              name="message" 
              rows={4}
              placeholder="Tell us what you're interested in (optional)" 
              className="w-full rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 px-4 py-3 outline-none focus:ring-2 focus:ring-[#33BECC]/40 focus:border-[#33BECC] resize-none" 
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
              disabled={submitting}
              variant="primary"
              size="lg"
            >
              {submitting ? 'Sending...' : 'Send Message'}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
