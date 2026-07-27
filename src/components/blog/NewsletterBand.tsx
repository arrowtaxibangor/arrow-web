'use client';
import { useState } from 'react';

export function NewsletterBand() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <section
      className="w-full py-20"
      style={{ background: 'linear-gradient(135deg, #0f2040 0%, #265EA6 100%)' }}
    >
      <div className="max-w-[1280px] mx-auto px-6 flex flex-col items-center text-center gap-6">
        <h2
          className="font-extrabold text-white leading-tight tracking-tight"
          style={{ fontSize: 'clamp(32px, 4vw, 50px)', maxWidth: 580 }}
        >
          Get travel tips & local updates
        </h2>
        <p className="text-white/70 text-[17px] leading-relaxed">
          Routes, Snowdonia guides, and airport tips from the Arrow Taxi team.
        </p>

        {submitted ? (
          <p className="text-white/90 text-[15px] font-medium">Thanks — we&apos;ll be in touch!</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-sm">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 rounded-full px-4 py-2.5 text-[14px] bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-white/60"
            />
            <button
              type="submit"
              className="rounded-full px-5 py-2.5 bg-white text-[14px] font-semibold text-[#265EA6] hover:bg-gray-100 transition-colors whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
