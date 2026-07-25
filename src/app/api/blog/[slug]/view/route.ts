import { NextRequest, NextResponse } from 'next/server';
import { incrementBlogViews } from '@/lib/supabase/blog';

type Params = { params: { slug: string } };

// POST /api/blog/[slug]/view — public; fire-and-forget view counter
// Called by <ViewTracker> client component on page load (Phase 3).
// Do not render the views count in the statically cached page template —
// the cached HTML will show a frozen count. Fetch it client-side if needed.
export async function POST(_req: NextRequest, { params }: Params) {
  try {
    await incrementBlogViews(params.slug);
    return NextResponse.json({ ok: true });
  } catch (err) {
    // Swallow silently — view counter is non-critical.
    console.error('[POST /api/blog/[slug]/view]', err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
