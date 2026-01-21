'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function PasswordAuth({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/williams-racing/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        onSuccess();
      } else {
        setError('Incorrect password. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#0f0f0f] text-white min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-[#1a1a1a] rounded-2xl border border-white/10 p-8 md:p-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#00A0E1' }}>
            Live Connected.
          </h1>
          <p className="text-white/80 text-lg">Williams Racing x Vonga</p>
          <p className="text-white/60 text-sm mt-2">Please enter the password to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-white/80 mb-2 font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 px-4 py-3 outline-none focus:ring-2 focus:ring-[#33BECC]/40 focus:border-[#33BECC]"
              placeholder="Enter password"
              required
              disabled={isSubmitting}
              autoFocus
            />
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-[#00A0E1] to-[#33BECC] hover:from-[#00A0E1]/90 hover:to-[#33BECC]/90 text-white border-0 px-8 py-6 text-lg font-semibold"
          >
            {isSubmitting ? 'Verifying...' : 'Access Site'}
          </Button>
        </form>
      </div>
    </div>
  );
}
