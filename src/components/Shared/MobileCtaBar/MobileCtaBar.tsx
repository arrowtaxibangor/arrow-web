'use client';
import Link from 'next/link';
import React from 'react';
import { PHONE_DISPLAY, PHONE_HREF } from '../../../../utils/contact';
import { BookingButton } from '../BookingButton/BookingButton';

/**
 * Sticky call/book bar pinned to the bottom of the viewport on phones.
 *
 * This is the primary conversion surface on mobile, so it is always reachable
 * without scrolling. Hidden from the `sm` breakpoint up, where the header
 * already exposes the phone number and the in-page CTAs are visible.
 *
 * Renders a matching spacer so the fixed bar never covers page content or the
 * footer's last row.
 */
export const MobileCtaBar = () => {
  return (
    <>
      {/* Spacer: reserves the bar's height in normal flow. */}
      <div aria-hidden="true" className="h-[72px] sm:hidden" />

      <div className="fixed bottom-0 left-0 right-0 z-50 flex items-stretch gap-2 border-t border-black/10 bg-white px-3 py-2 shadow-[0_-2px_10px_rgba(0,0,0,0.08)] sm:hidden">
        <Link
          href={PHONE_HREF}
          aria-label={`Call Arrow Taxi on ${PHONE_DISPLAY}`}
          className="flex min-h-[52px] flex-1 items-center justify-center rounded-full border-2 border-primary_color bg-white px-4 text-[16px] font-bold text-primary_color"
        >
          Call us
        </Link>
        <BookingButton label="Book now" size="compact" />
      </div>
    </>
  );
};
