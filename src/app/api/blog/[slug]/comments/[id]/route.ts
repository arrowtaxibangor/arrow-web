import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { deleteComment, updateComment } from '@/lib/supabase/blog';
import { sessionOptions, type SessionData } from '@/lib/auth/session';

type Params = { params: { slug: string; id: string } };

async function requireAdmin() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  if (!session.isLoggedIn) throw new Error('Unauthorized');
}

// PUT /api/blog/[slug]/comments/[id] — admin only; approve or reject
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    await requireAdmin();
    const { approved } = await req.json();
    const comment = await updateComment(params.id, { approved });
    return NextResponse.json({ comment });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('[PUT /api/blog/[slug]/comments/[id]]', err);
    return NextResponse.json({ error: 'Failed to update comment' }, { status: 500 });
  }
}

// DELETE /api/blog/[slug]/comments/[id] — admin only
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    await requireAdmin();
    await deleteComment(params.id);
    return NextResponse.json({ deleted: true });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('[DELETE /api/blog/[slug]/comments/[id]]', err);
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 });
  }
}
