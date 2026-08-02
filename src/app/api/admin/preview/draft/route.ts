import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions, type SessionData } from '@/lib/auth/session';
import { saveDraft, type DraftContent } from '@/lib/preview-drafts';

export const dynamic = 'force-dynamic';

async function requireAdmin() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  if (!session.isLoggedIn) throw new Error('Unauthorized');
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!body || typeof body !== 'object' || !('content' in body) || !('slug' in body)) {
    return NextResponse.json({ error: 'Missing content or slug' }, { status: 400 });
  }

  const { content, slug } = body as { content: DraftContent; slug: string | null };

  if (!['page', 'blog', 'homepage'].includes(content?.type)) {
    return NextResponse.json({ error: 'Invalid draft type' }, { status: 400 });
  }

  try {
    const token = await saveDraft(content, slug);
    return NextResponse.json({ token });
  } catch (err) {
    console.error('[preview/draft POST]', err);
    return NextResponse.json({ error: 'Failed to save draft' }, { status: 500 });
  }
}
