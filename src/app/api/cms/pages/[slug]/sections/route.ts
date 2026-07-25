import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { getPageBySlug, replacePageSections } from '@/lib/supabase/cms';
import { sessionOptions, type SessionData } from '@/lib/auth/session';
import { isProxyUrl, extractPublicId, deleteFromCloudinary } from '@/lib/cloudinary';

type Params = { params: { slug: string } };

async function requireAdmin() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  if (!session.isLoggedIn) throw new Error('Unauthorized');
}

// PUT /api/cms/pages/[slug]/sections — admin only
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    await requireAdmin();
    const page = await getPageBySlug(params.slug);
    if (!page) return NextResponse.json({ error: 'Page not found' }, { status: 404 });

    const { sections } = await req.json();
    if (!Array.isArray(sections)) {
      return NextResponse.json({ error: 'sections must be an array' }, { status: 400 });
    }

    // Collect proxy image URLs from old sections before replacing
    const oldProxyUrls = new Set(
      (page.sections ?? [])
        .map((s) => s.image_url)
        .filter((url): url is string => !!url && isProxyUrl(url))
    );
    const newImageUrls = new Set(
      sections.map((s: { image_url?: string }) => s.image_url).filter(Boolean)
    );

    const updated = await replacePageSections(page.id, sections);

    // Delete orphaned proxy images (fire-and-forget)
    oldProxyUrls.forEach((url) => {
      if (!newImageUrls.has(url)) {
        const pid = extractPublicId(url);
        if (pid) deleteFromCloudinary(pid).catch(console.error);
      }
    });

    return NextResponse.json({ sections: updated });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('[PUT /api/cms/pages/[slug]/sections]', err);
    return NextResponse.json({ error: 'Failed to update sections' }, { status: 500 });
  }
}
