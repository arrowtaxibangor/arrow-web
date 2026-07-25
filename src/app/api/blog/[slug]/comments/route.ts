import { NextRequest, NextResponse } from 'next/server';
import { createComment, getBlogPostWithWriter, listComments } from '@/lib/supabase/blog';

type Params = { params: { slug: string } };

function isAdminAuthorized(req: NextRequest): boolean {
  return req.headers.get('x-admin-key') === process.env.REVALIDATION_SECRET;
}

// GET /api/blog/[slug]/comments
// Public: returns approved comments only.
// Admin (x-admin-key header): returns all comments including unapproved.
export async function GET(req: NextRequest, { params }: Params) {
  const isAdmin = isAdminAuthorized(req);

  try {
    const post = await getBlogPostWithWriter(params.slug);
    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

    const comments = await listComments(post.id, !isAdmin);
    return NextResponse.json({ comments });
  } catch (err) {
    console.error('[GET /api/blog/[slug]/comments]', err);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

// POST /api/blog/[slug]/comments — public; comment submitted by reader
// All comments start unapproved and require admin moderation.
export async function POST(req: NextRequest, { params }: Params) {
  try {
    const post = await getBlogPostWithWriter(params.slug);
    if (!post || !post.published) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const { author_name, author_email, content } = await req.json();
    if (!author_name || !author_email || !content) {
      return NextResponse.json(
        { error: 'author_name, author_email and content are required' },
        { status: 400 }
      );
    }

    const comment = await createComment({ post_id: post.id, author_name, author_email, content });
    return NextResponse.json({ comment, pending: true }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/blog/[slug]/comments]', err);
    return NextResponse.json({ error: 'Failed to submit comment' }, { status: 500 });
  }
}
