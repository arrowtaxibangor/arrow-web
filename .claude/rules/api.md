# API route rules

Applies to all files under `src/app/api/`.

## Auth

Every admin API route (anything under `src/app/api/admin/`) must call `requireAdmin()` as the
very first statement in each handler function, before any `req.json()` or database call.

The pattern:

```ts
async function requireAdmin() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  if (!session.isLoggedIn) throw new Error('Unauthorized');
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // ... rest of handler
}
```

Public routes under `src/app/api/blog/` and `src/app/api/cms/` do not need auth for GET handlers,
but POST/PUT/DELETE handlers do.

## Response shape

- Success: `NextResponse.json({ data })` with an appropriate 2xx status
- Error: `NextResponse.json({ error: 'Human-readable message' }, { status: N })`
- Never expose raw error messages or stack traces in the response body — log with `console.error` and return a generic message

## Caching

Add `export const dynamic = 'force-dynamic'` to any admin route that must never be cached.
Public GET routes that aggregate CMS data should rely on ISR revalidation at the page level, not
route-level cache headers.

## No inline database calls

Admin routes must not call Supabase directly. All queries go through `src/lib/supabase/cms.ts` or
`src/lib/supabase/blog.ts`. If you need a query that does not exist there, add it to the correct
lib file first.

## File upload

Image upload is handled exclusively by `POST /api/admin/upload`. Do not accept file uploads in
any other route. The upload route validates MIME type (JPEG, PNG, WebP, GIF, AVIF) and enforces
a 5 MB limit — do not bypass these checks.

## AI streaming routes

Use `streamText` from the `ai` package and return `result.toTextStreamResponse()`. Do not buffer
the AI response and return it as JSON — this defeats streaming and increases latency.

```ts
import { streamText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';

const result = streamText({ model: anthropic('claude-sonnet-4-6'), prompt });
return result.toTextStreamResponse();
```
