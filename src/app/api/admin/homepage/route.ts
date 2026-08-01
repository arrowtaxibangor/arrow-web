import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions, type SessionData } from '@/lib/auth/session';
import {
  getAllHomepageContent,
  setHomepageField,
  HOMEPAGE_KEYS,
  type HomepageKey,
} from '@/lib/supabase/homepage';

export const dynamic = 'force-dynamic';

const NO_CACHE = { 'Cache-Control': 'no-store, no-cache, must-revalidate' };

async function requireAdmin() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  if (!session.isLoggedIn) throw new Error('Unauthorized');
}

export async function GET() {
  try {
    await requireAdmin();
    const content = await getAllHomepageContent();
    return NextResponse.json(content, { headers: NO_CACHE });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: NO_CACHE });
    }
    console.error('[homepage GET] error:', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500, headers: NO_CACHE });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await requireAdmin();
    const body = (await req.json()) as Record<string, unknown>;
    for (const key of HOMEPAGE_KEYS) {
      if (typeof body[key] === 'string') {
        await setHomepageField(key as HomepageKey, body[key] as string);
      }
    }
    return NextResponse.json({ ok: true }, { headers: NO_CACHE });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: NO_CACHE });
    }
    console.error('[homepage PUT] error:', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500, headers: NO_CACHE });
  }
}
