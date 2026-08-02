'use client';
import Link from 'next/link';
import React from 'react';
import { useBookingUrl } from '../../../../Hooks/useBookingUrl';
import { useCtaStyle, DEFAULT_CTA_STYLE } from '../../../../Hooks/useCtaStyle';

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

const BASE_CLASSES =
  'inline-flex items-center justify-center gap-2 rounded-xl font-bold shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary_color';

const SIZE_CLASSES: Record<BookingButtonSize, string> = {
  default: 'w-full sm:w-auto min-h-[48px] px-8 py-3',
  compact: 'flex-1 min-h-[52px] px-4',
  sidebar: 'w-full px-5 py-3',
};

// Fixed font sizes for space-constrained contexts; 'default' uses the CMS setting.
const FIXED_FONT_SIZE: Partial<Record<BookingButtonSize, number>> = {
  compact: 18,
  sidebar: 15,
};

export const BookingButton = ({
  label = 'Book Online',
  bookingUrl,
  href,
  className = '',
  size = 'default',
  trailingIcon,
}: BookingButtonProps) => {
  const { data: urlData } = useBookingUrl();
  const { data: ctaStyle } = useCtaStyle();
  const style = ctaStyle ?? DEFAULT_CTA_STYLE;
  const destination = href || bookingUrl || urlData || '#';
  const isExternal = !href;

  const inlineStyle: React.CSSProperties = {
    backgroundColor: style.bgColor,
    color: style.textColor,
    fontSize: FIXED_FONT_SIZE[size] ?? style.fontSize,
  };

  return (
    <Link
      href={destination}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className={`${BASE_CLASSES} ${SIZE_CLASSES[size]} ${className}`}
      style={inlineStyle}
    >
      {label}
      {trailingIcon}
    </Link>
  );
};
