import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { listAllCommentsAdmin } from '@/lib/supabase/blog';
import { sessionOptions, type SessionData } from '@/lib/auth/session';

// GET /api/admin/comments?filter=pending|approved|all
export async function GET(req: NextRequest) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const filter = new URL(req.url).searchParams.get('filter') ?? 'all';
  const approved = filter === 'pending' ? false : filter === 'approved' ? true : undefined;

  try {
    const comments = await listAllCommentsAdmin({ approved });
    return NextResponse.json({ comments });
  } catch (err) {
    console.error('[GET /api/admin/comments]', err);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}
