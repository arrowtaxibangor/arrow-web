'use client';
import { useQuery } from 'react-query';
import { getPageBySlug } from '../services/dynamicPages.service';
import { usePathname } from 'next/navigation';

// Routes rendered by their own React components rather than the dynamic page
// API. Requesting these slugs returned 404s from the backend, which surfaced as
// an uncaught AxiosError plus a "Failed to load booking details" log on every
// landing page.
const SKIP_SLUGS = [
  '',
  'contact',
  'luxury',
  'success',
  'blog',
  'caernarfon-taxi',
  'snowdon-taxi',
  'airport-transfers',
  'top-destinations',
  'thank-you',
  'bookings',
  'complete-booking',
];

export const usePageBySlug = () => {
  const pathname = usePathname(); // e.g., '/new-page-one'

  // Derive the slug defensively so useQuery below is always reached — returning
  // early here changed the hook count between the first and later renders.
  const segments = (pathname ?? '').split('/').filter(Boolean);
  const slug = segments[segments.length - 1] ?? '';

  const shouldFetch = !!pathname && !!slug && !SKIP_SLUGS.includes(slug);

  return useQuery(['get-page', slug], () => getPageBySlug(slug), {
    enabled: shouldFetch,
    retry: false,
  });
};
