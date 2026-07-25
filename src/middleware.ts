import { NextRequest, NextResponse } from 'next/server';
import { unsealData } from 'iron-session';
import type { SessionData } from './lib/auth/session';

const COOKIE_NAME = 'arrow-cms-session';

export async function middleware(req: NextRequest) {
  const host = req.headers.get('host') ?? '';
  const pathname = req.nextUrl.pathname;
  const isDev = host.startsWith('localhost') || host.startsWith('127.0.0.1');
  const isCmsHost = host === 'cms.arrow.taxi' || isDev;

  // On cms host (production): redirect non-admin/non-api paths to main site
  if (isCmsHost && !isDev) {
    if (
      !pathname.startsWith('/admin') &&
      !pathname.startsWith('/api') &&
      !pathname.startsWith('/_next')
    ) {
      return NextResponse.redirect('https://arrow.taxi');
    }
  }

  // On main host: admin paths return 404
  if (!isCmsHost && pathname.startsWith('/admin')) {
    return new NextResponse(null, { status: 404 });
  }

  // Auth check for admin routes (except login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const cookieValue = req.cookies.get(COOKIE_NAME)?.value;
    if (!cookieValue) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
    try {
      const data = await unsealData<SessionData>(cookieValue, {
        password: process.env.SESSION_SECRET!,
      });
      if (!data.isLoggedIn) {
        return NextResponse.redirect(new URL('/admin/login', req.url));
      }
    } catch {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
