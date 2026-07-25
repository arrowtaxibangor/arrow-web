import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions, type SessionData } from '@/lib/auth/session';
import { getSiteSetting, setSiteSetting } from '@/lib/supabase/cms';

export const dynamic = 'force-dynamic';

const NO_CACHE = { 'Cache-Control': 'no-store, no-cache, must-revalidate' };

async function requireAdmin() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  if (!session.isLoggedIn) throw new Error('Unauthorized');
}

export async function GET() {
  const booking_url = await getSiteSetting('booking_url');
  return NextResponse.json({ booking_url: booking_url ?? '' }, { headers: NO_CACHE });
}

export async function PUT(req: NextRequest) {
  try {
    await requireAdmin();
    const { booking_url } = await req.json();
    if (typeof booking_url !== 'string') {
      return NextResponse.json({ error: 'booking_url required' }, { status: 400 });
    }
    await setSiteSetting('booking_url', booking_url);
    return NextResponse.json({ ok: true }, { headers: NO_CACHE });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: NO_CACHE });
    }
    console.error('[settings PUT] error:', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500, headers: NO_CACHE });
  }
}
