'use client';
import { useState } from 'react';

export function NewsletterMiniCard() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div
      className="rounded-2xl p-6"
      style={{ background: 'linear-gradient(135deg, #0f2040 0%, #265EA6 100%)' }}
    >
      <h3 className="text-white font-bold text-[16px] leading-[1.3] mb-2">
        Get tips like this fortnightly
      </h3>
      <p className="text-white/60 text-[13px] leading-[1.55] mb-4">
        Airport guides, Snowdonia routes, and local travel tips. No fluff.
      </p>

      {submitted ? (
        <p className="text-white/80 text-[13px]">You&apos;re subscribed!</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="rounded-lg px-3 py-2 text-[13px] bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-white/60"
          />
          <button
            type="submit"
            className="rounded-lg px-4 py-2 bg-white text-[13px] font-semibold text-[#265EA6] hover:bg-gray-100 transition-colors"
          >
            Subscribe
          </button>
        </form>
      )}
    </div>
  );
}
