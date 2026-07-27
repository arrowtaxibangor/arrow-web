# Skill: New admin API route

Use this template when adding a new protected admin API route. Copy and adapt.

## Template

```ts
// src/app/api/admin/[resource]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions, type SessionData } from '@/lib/auth/session';
// import { yourLibFunction } from '@/lib/supabase/yourLib';

export const dynamic = 'force-dynamic';

const NO_CACHE = { 'Cache-Control': 'no-store, no-cache, must-revalidate' };

async function requireAdmin() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  if (!session.isLoggedIn) throw new Error('Unauthorized');
}

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: NO_CACHE });
  }

  try {
    // const data = await yourLibFunction();
    return NextResponse.json({ data: [] }, { headers: NO_CACHE });
  } catch (err) {
    console.error('[GET /api/admin/resource]', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500, headers: NO_CACHE });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: NO_CACHE });
  }

  try {
    const body = await req.json();
    // validate body fields here
    // const result = await yourCreateFunction(body);
    return NextResponse.json({ ok: true }, { status: 201, headers: NO_CACHE });
  } catch (err: unknown) {
    console.error('[POST /api/admin/resource]', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500, headers: NO_CACHE });
  }
}
```

## Rules to remember
- `requireAdmin()` is always the first call in every handler — before reading body or DB
- All DB access goes through a lib function in `src/lib/supabase/` — never inline
- Use `NO_CACHE` headers on admin responses
- Log errors with `console.error`, return a generic message to the client
