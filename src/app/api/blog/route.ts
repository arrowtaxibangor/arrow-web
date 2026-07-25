import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { createBlogPost, listBlogPosts } from '@/lib/supabase/blog';
import { sessionOptions, type SessionData } from '@/lib/auth/session';

async function requireAdmin() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  if (!session.isLoggedIn) throw new Error('Unauthorized');
}

// GET /api/blog — public; returns published posts
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category') ?? undefined;
  const featured = searchParams.get('featured');
  const limit = searchParams.get('limit');

  try {
    const posts = await listBlogPosts({
      publishedOnly: true,
      category: category as never,
      featured: featured !== null ? featured === 'true' : undefined,
      limit: limit ? Number(limit) : undefined,
    });
    return NextResponse.json({ posts });
  } catch (err) {
    console.error('[GET /api/blog]', err);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

// POST /api/blog — admin only
export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const post = await createBlogPost(body);
    return NextResponse.json({ post }, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('[POST /api/blog]', err);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
