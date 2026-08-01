'use client';
import Link from 'next/link';
import React from 'react';
import { useBookingUrl } from '../../../../Hooks/useBookingUrl';

type BookingButtonProps = {
  label?: string;
  bookingUrl?: string;
  /** Override the destination entirely (e.g. an internal path like '/') */
  href?: string;
  className?: string;
};

export const BookingButton = ({
  label = 'Book a taxi now',
  bookingUrl,
  href,
  className = '',
}: BookingButtonProps) => {
  const { data } = useBookingUrl();
  const destination = href || bookingUrl || data || '#';
  const isExternal = !href;

  return (
    <Link
      href={destination}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className={`inline-flex w-full sm:w-auto min-h-[48px] items-center justify-center rounded-xl bg-[#FEC601] px-8 py-3 text-center text-[18px] mobile:text-[16px] font-bold text-white shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary_color ${className}`}
    >
      {label}
    </Link>
  );
};
