# Database rules

Applies to all Supabase usage in the project.

## Two clients — never mix them up

`src/lib/supabase/client.ts` exports two clients:

- `supabase` — anon key, for future client-side RLS-protected reads. Currently unused in most flows.
- `supabaseAdmin` — service-role key, bypasses RLS. **Server-side only.**

**Never import `supabaseAdmin` in:**

- Any file with `'use client'` at the top
- Any file under `src/components/` (unless it is a Server Component with no `'use client'`)
- Any utility file that is also imported by client components

The service-role key grants full database access. Exposing it to the browser is a critical security vulnerability.

## Query functions live in lib files

All Supabase queries must be written as exported functions in one of:

- `src/lib/supabase/cms.ts` — for `cms_pages`, `cms_sections`, `site_settings`
- `src/lib/supabase/blog.ts` — for `blog_posts`, `blog_comments`, `writer_profiles`

Route handlers call these functions. They do not construct Supabase queries themselves.

If a new table is added, create a corresponding lib file (e.g. `src/lib/supabase/bookings.ts`).

## Error handling

Supabase errors have a `.code` property. The code `PGRST116` means "no rows found" — treat this
as a `null` return, not a thrown error. All other error codes should be thrown.

```ts
const { data, error } = await supabaseAdmin.from('cms_pages').select('*').eq('slug', slug).single();
if (error) {
  if (error.code === 'PGRST116') return null;
  throw error;
}
```

## Upsert for settings

`site_settings` uses upsert with `onConflict: 'key'`:

```ts
await supabaseAdmin.from('site_settings').upsert({ key, value }, { onConflict: 'key' });
```

## Migrations

SQL migrations live in `migrations/`. They are applied manually via the Supabase dashboard SQL
editor or the Supabase CLI. Do not run migrations programmatically from application code.

## Section replacement is not atomic

`replacePageSections()` in `cms.ts` deletes then inserts — if the insert fails, sections will be
empty. This is a known limitation. Do not refactor this without converting it to a Postgres RPC
function for true atomicity.
