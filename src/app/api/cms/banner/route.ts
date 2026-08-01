import { NextResponse } from 'next/server';
import { getAllHomepageContent } from '@/lib/supabase/homepage';

export const dynamic = 'force-dynamic';

const NO_CACHE = { 'Cache-Control': 'no-store, no-cache, must-revalidate' };

export async function GET() {
  try {
    const content = await getAllHomepageContent();
    return NextResponse.json(
      {
        banner_heading: content.banner_heading ?? content.hero_heading,
        banner_subtext: content.banner_subtext ?? content.hero_subtext,
        banner_image: content.banner_image,
      },
      { headers: NO_CACHE }
    );
  } catch (err) {
    console.error('[cms/banner GET] error:', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500, headers: NO_CACHE });
  }
}
