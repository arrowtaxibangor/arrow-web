import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { deleteBlogPost, getBlogPostWithWriter, updateBlogPost } from '@/lib/supabase/blog';
import { sessionOptions, type SessionData } from '@/lib/auth/session';
import { isProxyUrl, extractPublicId, deleteFromCloudinary } from '@/lib/cloudinary';

type Params = { params: { slug: string } };

async function requireAdmin() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  if (!session.isLoggedIn) throw new Error('Unauthorized');
}

// GET /api/blog/[slug] — public
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const post = await getBlogPostWithWriter(params.slug);
    if (!post || !post.published) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ post });
  } catch (err) {
    console.error('[GET /api/blog/[slug]]', err);
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

// PUT /api/blog/[slug] — admin only
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    await requireAdmin();
    const body = await req.json();

    const oldPost = await getBlogPostWithWriter(params.slug);
    const post = await updateBlogPost(params.slug, body);

    // Delete the replaced cover image from Cloudinary (fire-and-forget)
    const oldUrl = oldPost?.cover_image_url;
    const newUrl = body.cover_image_url ?? null;
    if (oldUrl && oldUrl !== newUrl && isProxyUrl(oldUrl)) {
      const pid = extractPublicId(oldUrl);
      if (pid) deleteFromCloudinary(pid).catch(console.error);
    }

    return NextResponse.json({ post });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('[PUT /api/blog/[slug]]', err);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

// DELETE /api/blog/[slug] — admin only
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    await requireAdmin();
    await deleteBlogPost(params.slug);
    return NextResponse.json({ deleted: true });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('[DELETE /api/blog/[slug]]', err);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
