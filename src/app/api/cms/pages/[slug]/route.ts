import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { deletePage, getPageBySlug, updatePage } from '@/lib/supabase/cms';
import { sessionOptions, type SessionData } from '@/lib/auth/session';

type Params = { params: { slug: string } };

async function requireAdmin() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  if (!session.isLoggedIn) throw new Error('Unauthorized');
}

// GET /api/cms/pages/[slug] — public
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const page = await getPageBySlug(params.slug);
    if (!page) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ page });
  } catch (err) {
    console.error('[GET /api/cms/pages/[slug]]', err);
    return NextResponse.json({ error: 'Failed to fetch page' }, { status: 500 });
  }
}

// PUT /api/cms/pages/[slug] — admin only
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    await requireAdmin();
    const body = await req.json();
    const page = await updatePage(params.slug, body);
    return NextResponse.json({ page });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('[PUT /api/cms/pages/[slug]]', err);
    return NextResponse.json({ error: 'Failed to update page' }, { status: 500 });
  }
}

// DELETE /api/cms/pages/[slug] — admin only
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    await requireAdmin();
    await deletePage(params.slug);
    return NextResponse.json({ deleted: true });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('[DELETE /api/cms/pages/[slug]]', err);
    return NextResponse.json({ error: 'Failed to delete page' }, { status: 500 });
  }
}
