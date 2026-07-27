import { NextResponse } from 'next/server';
import { getSiteSetting } from '@/lib/supabase/cms';

// Public read-only endpoint for the site settings that client components need.
// The root layout is a client component, so the Banner, footer and mobile CTA
// bar cannot receive a server-fetched booking URL as a prop — they read it from
// here instead. Server components keep calling getSiteSetting() directly.
// Both paths resolve the same site_settings.booking_url row.
export async function GET() {
  try {
    const bookingUrl = await getSiteSetting('booking_url');
    return NextResponse.json(
      { bookingUrl: bookingUrl ?? '' },
      { headers: { 'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600' } }
    );
  } catch (error) {
    console.error('Failed to read booking_url site setting', error);
    return NextResponse.json({ error: 'Unable to load site settings' }, { status: 500 });
  }
}
