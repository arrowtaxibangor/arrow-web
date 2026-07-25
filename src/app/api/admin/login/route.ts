import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions, type SessionData } from '@/lib/auth/session';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  // TEMP DEBUG — remove after diagnosing login failure
  const storedHash = process.env.ADMIN_PASSWORD_HASH ?? '';
  const compareResult = password ? await bcrypt.compare(password, storedHash) : false;
  console.log('[login-debug] ADMIN_PASSWORD_HASH defined:', !!process.env.ADMIN_PASSWORD_HASH);
  console.log('[login-debug] ADMIN_PASSWORD_HASH length:', storedHash.length);
  console.log('[login-debug] ADMIN_EMAIL match:', email === process.env.ADMIN_EMAIL);
  console.log('[login-debug] bcrypt.compare result:', compareResult);
  // END TEMP DEBUG

  if (email !== process.env.ADMIN_EMAIL || !password || !compareResult) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  session.isLoggedIn = true;
  session.email = email;
  await session.save();

  return NextResponse.json({ ok: true });
}
