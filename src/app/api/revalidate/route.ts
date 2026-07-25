import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { slug, type, secret } = await req.json();

  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (type === 'blog') {
    revalidatePath(`/blog/${slug}`);
    revalidatePath('/blog');
  } else if (slug) {
    revalidatePath(`/${slug}`);
  }

  revalidatePath('/');

  return NextResponse.json({ revalidated: true, slug, type });
}
