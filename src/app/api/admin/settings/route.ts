import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions, type SessionData } from '@/lib/auth/session';
import {
  getSiteSetting,
  getSocialIcons,
  setSiteSetting,
  setSocialIcons,
  SUPPORTED_SOCIAL_ICONS,
  type SocialIcon,
  type SupportedSocialIcon,
} from '@/lib/supabase/cms';

export const dynamic = 'force-dynamic';

const NO_CACHE = { 'Cache-Control': 'no-store, no-cache, must-revalidate' };

async function requireAdmin() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  if (!session.isLoggedIn) throw new Error('Unauthorized');
}

function isSupportedIcon(value: unknown): value is SupportedSocialIcon {
  return typeof value === 'string' && (SUPPORTED_SOCIAL_ICONS as readonly string[]).includes(value);
}

function parseIconPayload(value: unknown): SocialIcon[] | null {
  if (!Array.isArray(value)) return null;
  const out: SocialIcon[] = [];
  for (const entry of value) {
    if (
      !entry ||
      typeof entry !== 'object' ||
      !('icon' in entry) ||
      !('url' in entry) ||
      !isSupportedIcon((entry as { icon: unknown }).icon) ||
      typeof (entry as { url: unknown }).url !== 'string'
    ) {
      return null;
    }
    out.push({
      icon: (entry as { icon: SupportedSocialIcon }).icon,
      url: (entry as { url: string }).url,
    });
  }
  return out;
}

export async function GET() {
  const [booking_url, social_icons, cta_bg_color, cta_text_color, cta_font_size_raw] =
    await Promise.all([
      getSiteSetting('booking_url'),
      getSocialIcons(),
      getSiteSetting('cta_bg_color'),
      getSiteSetting('cta_text_color'),
      getSiteSetting('cta_font_size'),
    ]);
  const cta_font_size = cta_font_size_raw ? parseInt(cta_font_size_raw, 10) : 18;
  return NextResponse.json(
    {
      booking_url: booking_url ?? '',
      social_icons,
      cta_bg_color: cta_bg_color ?? '#FEC601',
      cta_text_color: cta_text_color ?? '#ffffff',
      cta_font_size: Number.isFinite(cta_font_size) ? cta_font_size : 18,
    },
    { headers: NO_CACHE }
  );
}

export async function PUT(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();

    if ('booking_url' in body) {
      if (typeof body.booking_url !== 'string') {
        return NextResponse.json({ error: 'booking_url must be a string' }, { status: 400 });
      }
      await setSiteSetting('booking_url', body.booking_url);
    }

    if ('social_icons' in body) {
      const icons = parseIconPayload(body.social_icons);
      if (icons === null) {
        return NextResponse.json(
          { error: 'social_icons must be an array of { icon, url } with supported icons' },
          { status: 400 }
        );
      }
      await setSocialIcons(icons);
    }

    if ('cta_bg_color' in body) {
      if (
        typeof body.cta_bg_color !== 'string' ||
        !/^#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/.test(body.cta_bg_color)
      ) {
        return NextResponse.json(
          { error: 'cta_bg_color must be a valid hex colour' },
          { status: 400 }
        );
      }
      await setSiteSetting('cta_bg_color', body.cta_bg_color);
    }

    if ('cta_text_color' in body) {
      if (
        typeof body.cta_text_color !== 'string' ||
        !/^#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/.test(body.cta_text_color)
      ) {
        return NextResponse.json(
          { error: 'cta_text_color must be a valid hex colour' },
          { status: 400 }
        );
      }
      await setSiteSetting('cta_text_color', body.cta_text_color);
    }

    if ('cta_font_size' in body) {
      const size = Number(body.cta_font_size);
      if (!Number.isInteger(size) || size < 10 || size > 32) {
        return NextResponse.json(
          { error: 'cta_font_size must be an integer between 10 and 32' },
          { status: 400 }
        );
      }
      await setSiteSetting('cta_font_size', String(size));
    }

    return NextResponse.json({ ok: true }, { headers: NO_CACHE });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: NO_CACHE });
    }
    console.error('[settings PUT] error:', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500, headers: NO_CACHE });
  }
}
