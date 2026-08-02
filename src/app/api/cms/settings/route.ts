import { NextResponse } from 'next/server';
import { getSiteSetting, getSocialIcons } from '@/lib/supabase/cms';

// Public read-only endpoint for the site settings that client components need.
// The root layout is a client component, so the Banner, footer and mobile CTA
// bar cannot receive server-fetched values as props — they read them from here
// instead. Server components keep calling getSiteSetting() directly.
export async function GET() {
  try {
    const [bookingUrl, socialIcons, ctaBgColor, ctaTextColor, ctaFontSizeRaw] = await Promise.all([
      getSiteSetting('booking_url'),
      getSocialIcons(),
      getSiteSetting('cta_bg_color'),
      getSiteSetting('cta_text_color'),
      getSiteSetting('cta_font_size'),
    ]);
    const ctaFontSize = ctaFontSizeRaw ? parseInt(ctaFontSizeRaw, 10) : 18;
    return NextResponse.json(
      {
        bookingUrl: bookingUrl ?? '',
        socialIcons,
        ctaBgColor: ctaBgColor ?? '#FEC601',
        ctaTextColor: ctaTextColor ?? '#ffffff',
        ctaFontSize: Number.isFinite(ctaFontSize) ? ctaFontSize : 18,
      },
      { headers: { 'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600' } }
    );
  } catch (error) {
    console.error('Failed to read site settings', error);
    return NextResponse.json({ error: 'Unable to load site settings' }, { status: 500 });
  }
}
