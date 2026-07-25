import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions, type SessionData } from '@/lib/auth/session';
import { updateWriterProfile, deleteWriterProfile } from '@/lib/supabase/blog';
import { supabaseAdmin } from '@/lib/supabase/client';
import { isProxyUrl, extractPublicId, deleteFromCloudinary } from '@/lib/cloudinary';

type Params = { params: { id: string } };

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  if (!session.isLoggedIn) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const data = await req.json();

  // Fetch old avatar_url before updating
  const { data: oldWriter } = await supabaseAdmin
    .from('writer_profiles')
    .select('avatar_url')
    .eq('id', params.id)
    .single();

  const profile = await updateWriterProfile(params.id, data);

  // Delete replaced proxy avatar (fire-and-forget)
  const oldUrl = oldWriter?.avatar_url;
  const newUrl = data.avatar_url ?? null;
  if (oldUrl && oldUrl !== newUrl && isProxyUrl(oldUrl)) {
    const pid = extractPublicId(oldUrl);
    if (pid) deleteFromCloudinary(pid).catch(console.error);
  }

  return NextResponse.json({ profile });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  if (!session.isLoggedIn) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await deleteWriterProfile(params.id);
  return NextResponse.json({ ok: true });
}
