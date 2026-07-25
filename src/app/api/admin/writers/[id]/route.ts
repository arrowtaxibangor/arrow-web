import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions, type SessionData } from '@/lib/auth/session';
import { updateWriterProfile, deleteWriterProfile } from '@/lib/supabase/blog';

type Params = { params: { id: string } };

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  if (!session.isLoggedIn) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const data = await req.json();
  const profile = await updateWriterProfile(params.id, data);
  return NextResponse.json({ profile });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  if (!session.isLoggedIn) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await deleteWriterProfile(params.id);
  return NextResponse.json({ ok: true });
}
