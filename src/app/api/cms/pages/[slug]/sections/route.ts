import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { getPageBySlug, replacePageSections } from '@/lib/supabase/cms';
import { sessionOptions, type SessionData } from '@/lib/auth/session';

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

    const updated = await replacePageSections(page.id, sections);
    return NextResponse.json({ sections: updated });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('[PUT /api/cms/pages/[slug]/sections]', err);
    return NextResponse.json({ error: 'Failed to update sections' }, { status: 500 });
  }
}
