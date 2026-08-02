import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { sessionOptions, type SessionData } from '@/lib/auth/session';
import { upsertButtonVariant, deleteButtonVariant } from '@/lib/supabase/cms';

export const dynamic = 'force-dynamic';

async function requireAdmin() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  if (!session.isLoggedIn) throw new Error('Unauthorized');
}

export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
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

  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const b = body as Record<string, unknown>;

  try {
    const variant = await upsertButtonVariant(params.slug, {
      ...(typeof b.label === 'string' && { label: b.label }),
      ...(typeof b.bg_color === 'string' && { bg_color: b.bg_color }),
      ...(typeof b.text_color === 'string' && { text_color: b.text_color }),
      ...(typeof b.font_size === 'number' && { font_size: b.font_size }),
      ...(typeof b.border_radius === 'number' && { border_radius: b.border_radius }),
      ...(typeof b.padding_x === 'number' && { padding_x: b.padding_x }),
      ...(typeof b.padding_y === 'number' && { padding_y: b.padding_y }),
      ...(typeof b.font_weight === 'number' && { font_weight: b.font_weight }),
      ...(typeof b.is_default === 'boolean' && { is_default: b.is_default }),
    });
    revalidatePath('/', 'layout');
    return NextResponse.json({ variant });
  } catch (err) {
    console.error('[button-variants PUT]', err);
    return NextResponse.json({ error: 'Failed to update variant' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await deleteButtonVariant(params.slug);
    revalidatePath('/', 'layout');
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[button-variants DELETE]', err);
    return NextResponse.json({ error: 'Failed to delete variant' }, { status: 500 });
  }
}
