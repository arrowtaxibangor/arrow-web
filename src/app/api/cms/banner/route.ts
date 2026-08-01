import { NextResponse } from 'next/server';
import { getAllHomepageContent } from '@/lib/supabase/homepage';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const content = await getAllHomepageContent();
    return NextResponse.json({
      banner_heading: content.banner_heading,
      banner_subtext: content.banner_subtext,
      banner_image: content.banner_image,
    });
  } catch (err) {
    console.error('[cms/banner GET] error:', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
