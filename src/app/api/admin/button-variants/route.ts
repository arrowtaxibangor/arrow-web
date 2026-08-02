import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { sessionOptions, type SessionData } from '@/lib/auth/session';
import { getButtonVariants, upsertButtonVariant } from '@/lib/supabase/cms';

export const dynamic = 'force-dynamic';

const NO_CACHE = { 'Cache-Control': 'no-store' };

async function requireAdmin() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  if (!session.isLoggedIn) throw new Error('Unauthorized');
}

export async function GET() {
  try {
    const variants = await getButtonVariants();
    return NextResponse.json({ variants }, { headers: NO_CACHE });
  } catch (err) {
    console.error('[button-variants GET]', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
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

  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const b = body as Record<string, unknown>;
  if (typeof b.slug !== 'string' || !b.slug.trim()) {
    return NextResponse.json({ error: 'slug is required' }, { status: 400 });
  }
  if (typeof b.label !== 'string' || !b.label.trim()) {
    return NextResponse.json({ error: 'label is required' }, { status: 400 });
  }

  try {
    const variant = await upsertButtonVariant(b.slug as string, {
      label: b.label as string,
      bg_color: typeof b.bg_color === 'string' ? b.bg_color : '#FEC601',
      text_color: typeof b.text_color === 'string' ? b.text_color : '#ffffff',
      font_size: typeof b.font_size === 'number' ? b.font_size : 18,
      border_radius: typeof b.border_radius === 'number' ? b.border_radius : 12,
      padding_x: typeof b.padding_x === 'number' ? b.padding_x : 40,
      padding_y: typeof b.padding_y === 'number' ? b.padding_y : 16,
      font_weight: typeof b.font_weight === 'number' ? b.font_weight : 700,
      is_default: typeof b.is_default === 'boolean' ? b.is_default : false,
    });
    revalidatePath('/', 'layout');
    return NextResponse.json({ variant }, { status: 201 });
  } catch (err) {
    console.error('[button-variants POST]', err);
    return NextResponse.json({ error: 'Failed to create variant' }, { status: 500 });
  }
}
