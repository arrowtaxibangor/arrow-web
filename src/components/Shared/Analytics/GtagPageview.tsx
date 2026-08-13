'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

const TAG_ID = 'GT-KD2VRCS7';

type GtagFn = (command: 'event', eventName: string, params: Record<string, unknown>) => void;

/**
 * Fires a manual `page_view` on every client-side route change. gtag.js only
 * auto-tracks the first pageview because `send_page_view` is disabled in the
 * base config — App Router transitions do not reload the layout, so without
 * this component subsequent navigations would be invisible to GA4 / Ads.
 */
export function GtagPageview() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const w = window as unknown as { gtag?: GtagFn };
    if (typeof w.gtag !== 'function') return;

    const path = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    w.gtag('event', 'page_view', {
      send_to: TAG_ID,
      page_path: path,
      page_location: window.location.origin + path,
      page_title: document.title,
    });
  }, [pathname, searchParams]);

  return null;
}
