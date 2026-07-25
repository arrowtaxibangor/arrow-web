'use client';
import { useQuery } from 'react-query';
import { getPageBySlug } from '../services/dynamicPages.service';
import { usePathname } from 'next/navigation';

export const usePageBySlug = () => {
  const pathname = usePathname(); // e.g., '/new-page-one'
  if (!pathname) return { data: undefined, isLoading: false }; // prevent errors on first render

  // Extract slug from URL
  const segments = pathname.split('/').filter(Boolean); // ['new-page-one']
  const slug = segments[segments.length - 1]; // take last segment

  // Skip API for known static paths
  const SKIP_SLUGS = ['', 'contact', 'luxury', 'success'];

  const shouldFetch = !!slug && !SKIP_SLUGS.includes(slug);

  return useQuery(['get-page', slug], () => getPageBySlug(slug), {
    enabled: shouldFetch,
    retry: 2,
    onError: (err: any) => {
      console.log(err?.response?.data?.message || 'Failed to load booking details');
    },
  });
};
