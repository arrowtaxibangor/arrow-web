'use client';
import { useQuery } from 'react-query';

type SettingsResponse = { bookingUrl: string };

async function fetchBookingUrl(): Promise<string> {
  // Booking URL temporarily disabled — restore the fetch below when ready
  return '';
  const res = await fetch('/api/cms/settings');
  if (!res.ok) throw new Error('Failed to load site settings');
  const data: SettingsResponse = await res.json();
  return data.bookingUrl ?? '';
}

/**
 * Reads the iCabby booking URL from site_settings.booking_url.
 *
 * Client-side counterpart to getSiteSetting('booking_url'); server components
 * call that directly and pass the value down as a prop. Both resolve the same
 * database row, so there is exactly one source of truth for the booking URL.
 */
export function useBookingUrl() {
  return useQuery(['booking-url'], fetchBookingUrl, {
    retry: false,
    refetchInterval: false,
    staleTime: Infinity,
  });
}
