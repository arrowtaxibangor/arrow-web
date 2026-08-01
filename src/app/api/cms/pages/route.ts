import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { countPages, createPage, listPublishedPages, MAX_MAIN_PAGES } from '@/lib/supabase/cms';
import { sessionOptions, type SessionData } from '@/lib/auth/session';

const MAX_PAGES_MESSAGE = `Maximum of ${MAX_MAIN_PAGES} main pages reached, delete or archive an existing page to add a new one`;

async function requireAdmin() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  if (!session.isLoggedIn) throw new Error('Unauthorized');
}

// GET /api/cms/pages — public; used by header/footer nav
export async function GET() {
  try {
    const pages = await listPublishedPages();
    // Return camelCase shape for backward compat with existing Header/Footer components.
    const formatted = pages.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      isPublished: p.is_published,
      isInHeader: p.is_in_header,
    }));
    return NextResponse.json({ pages: formatted });
  } catch (err) {
    console.error('[GET /api/cms/pages]', err);
    return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 });
  }
}

// POST /api/cms/pages — admin only
export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const existing = await countPages();
    if (existing >= MAX_MAIN_PAGES) {
      return NextResponse.json({ error: MAX_PAGES_MESSAGE }, { status: 409 });
    }
    const body = await req.json();
    const page = await createPage(body);
    return NextResponse.json({ page }, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('[POST /api/cms/pages]', err);
    return NextResponse.json({ error: 'Failed to create page' }, { status: 500 });
  }
}
