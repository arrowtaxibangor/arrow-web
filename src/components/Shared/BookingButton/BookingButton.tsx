'use client';
import Link from 'next/link';
import React from 'react';
import { useBookingUrl } from '../../../../Hooks/useBookingUrl';

type BookingButtonProps = {
  /** Visible label. Defaults to the site-wide primary CTA wording. */
  label?: string;
  /**
   * Server-resolved booking URL. Server components already fetch this via
   * getSiteSetting('booking_url') — pass it in to skip the client request.
   */
  bookingUrl?: string;
  /** Extra classes appended after the base styles. */
  className?: string;
};

/**
 * The site's primary conversion control.
 *
 * Mobile-first: full width and 48px tall by default so it clears the 44px
 * minimum tap target, shrinking to an inline pill from the `sm` breakpoint up.
 * Never hardcode the booking href — it always resolves from
 * site_settings.booking_url.
 */
export const BookingButton = ({
  label = 'Book a taxi now',
  bookingUrl,
  className = '',
}: BookingButtonProps) => {
  const { data } = useBookingUrl();
  const href = bookingUrl || data || '#';

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex w-full sm:w-auto min-h-[48px] items-center justify-center rounded-full bg-[#FEC601] px-8 py-3 text-center text-[18px] mobile:text-[16px] font-bold text-black shadow-lg transition-colors hover:bg-yellow-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary_color ${className}`}
    >
      {label}
    </Link>
  );
};
