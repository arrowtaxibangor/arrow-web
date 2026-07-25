import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions, type SessionData } from '@/lib/auth/session';

export async function POST(req: NextRequest) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { type, slug } = await req.json();
  if (type === 'blog') {
    revalidatePath(`/blog/${slug}`);
    revalidatePath('/blog');
  } else {
    revalidatePath(`/${slug}`);
  }
  revalidatePath('/');
  return NextResponse.json({ revalidated: true });
}
