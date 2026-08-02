'use client';
import Link from 'next/link';
import React from 'react';
import { useBookingUrl } from '../../../../Hooks/useBookingUrl';

type BookingButtonSize = 'default' | 'compact' | 'sidebar';

type BookingButtonProps = {
  label?: string;
  bookingUrl?: string;
  /** Override the destination entirely (e.g. an internal path like '/') */
  href?: string;
  className?: string;
  /** Preset sizing — 'default' full CTA, 'compact' for mobile bar, 'sidebar' for the sticky card */
  size?: BookingButtonSize;
  /** Optional icon rendered after the label */
  trailingIcon?: React.ReactNode;
};

const VISUAL_CLASSES =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-[#FEC601] font-bold text-white shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary_color';

const SIZE_CLASSES: Record<BookingButtonSize, string> = {
  default: 'w-full sm:w-auto min-h-[48px] px-8 py-3 text-[18px] mobile:text-[16px]',
  compact: 'flex-1 min-h-[52px] px-4 text-[16px]',
  sidebar: 'w-full px-5 py-3 text-[15px]',
};

export const BookingButton = ({
  label = 'Book a taxi now',
  bookingUrl,
  href,
  className = '',
  size = 'default',
  trailingIcon,
}: BookingButtonProps) => {
  const { data } = useBookingUrl();
  const destination = href || bookingUrl || data || '#';
  const isExternal = !href;

  return (
    <Link
      href={destination}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className={`${VISUAL_CLASSES} ${SIZE_CLASSES[size]} ${className}`}
    >
      {label}
      {trailingIcon}
    </Link>
  );
};
