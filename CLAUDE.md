# Arrow Taxi — Claude Code Context

## Project

Arrow Taxi is a taxi and private-hire booking platform serving Bangor and North Wales. The codebase
is a single Next.js 14 App Router app that serves two distinct surfaces: the public booking site
(`arrow.taxi`) and a headless CMS admin (`cms.arrow.taxi`) for managing pages, blog posts, and
site settings.

## Tech stack

- **Framework:** Next.js 14 App Router, TypeScript
- **Database:** Supabase (PostgreSQL) via `@supabase/supabase-js`
- **Auth:** iron-session v8 (cookie-based, server-only, `arrow-cms-session` cookie)
- **CSS:** Tailwind CSS (custom breakpoints, all `max-width`) + Ant Design 5 (public site) + shadcn/ui Radix components (admin only)
- **Image storage:** Cloudinary (signed server-side upload) served via Cloudflare proxy at `images.arrow.taxi`
- **AI:** Vercel AI SDK (`ai`) + `@ai-sdk/anthropic`, model `claude-sonnet-4-6`
- **Client state:** Zustand v5 (`store/useStore.ts`), React Query v3
- **Package manager:** npm

## Folder structure (non-obvious parts)

```
src/
  app/
    api/
      admin/     # Protected CMS API (login, logout, upload, settings, writers)
      blog/      # Public blog + admin blog CRUD
      ai/        # AI text generation endpoints (generate, improve, seo)
      cms/       # CMS pages CRUD
    admin/       # Admin dashboard UI pages (served only on cms.arrow.taxi)
  lib/
    supabase/
      client.ts  # supabase (anon) + supabaseAdmin (service role — server only)
      cms.ts     # All cms_pages / cms_sections / site_settings query functions
      blog.ts    # All blog_posts / blog_comments / writer_profiles query functions
    auth/
      session.ts # iron-session config and SessionData type
    cloudinary.ts # Upload / delete / proxy URL helpers
  components/
    admin/       # Admin-only UI components
    ui/          # shadcn/ui primitives (Button, Input, etc.) — used in admin
    Shared/      # Public site shared components (Header, Footer)
services/        # Axios-based services for the external backend API (bookings, vehicles, fares)
Hooks/           # Custom React hooks (useFareData, useLocationSet, etc.)
store/           # Zustand stores (useBookingStore, useGoogleMapsStore)
utils/           # Axios client, fare calculation, nav items
types/           # Global TypeScript types
migrations/      # SQL migration files (run manually via Supabase dashboard)
```

## Two separate API concerns

**CMS/blog data** — Supabase, server-side only:

- Always call functions from `src/lib/supabase/cms.ts` or `src/lib/supabase/blog.ts`
- Never write raw Supabase queries inline in route handlers

**Booking/vehicles/fares** — external backend at `NEXT_PUBLIC_BACKEND_URL`:

- Always go through `services/` files that import `utils/axios.ts`
- Axios client auto-attaches `auth-token` from `localStorage['arrow-taxi']`

## Auth flow (admin)

1. User visits any `/admin/*` path
2. `middleware.ts` reads the `arrow-cms-session` cookie and unseals it via iron-session
3. If missing or invalid → redirect to `/admin/login`
4. On login (`POST /api/admin/login`) → `getIronSession()` sets `isLoggedIn: true` on the cookie
5. Every protected API route calls `requireAdmin()` as its first line — reads the session server-side and throws `'Unauthorized'` if not logged in
6. On the main domain `arrow.taxi`, all `/admin/*` paths return 404

## Brand / design

- Primary blue: `primary_color` in Tailwind (`#265EA6`) — use the Tailwind class, not the hex value inline
- Accent yellow: `#FEC601` — used for fare reasoning text; no Tailwind alias, use inline where needed
- Admin font: `Roboto, Arial, sans-serif` (set on the admin root div)
- Custom Tailwind breakpoints are all `max-width` (mobile-first inverted): `mobile` 575px, `mobilelg` 650px, `tablet` 768px, `tabletlg` 992px, `desktop` 1200px
- shadcn/ui components (Button, Input, etc.) are used in the admin only — the public site uses Ant Design 5

## Tooling quirks

- `npm run build` runs Prettier before Next.js build — format is enforced at build time
- There is no test suite — do not add test files or test tooling unless explicitly asked
- `utils/calculateFare.ts` is entirely commented-out legacy code — do not read, modify, or revive it; active fare logic is `utils/useCalculateMultiVehicleFare.ts`
- `next.config.mjs` does not allowlist `images.arrow.taxi` for `<Image>` — use a plain `<img>` tag for Cloudinary-uploaded assets (the admin `ImageField` component already does this)
- Timestamps sent to the external backend must be formatted in `Europe/London` timezone using `moment-timezone`

## Key rules

- **Never import `supabaseAdmin` in a client component or any file that could be bundled client-side.** It uses the Supabase service-role key. Server components and API routes only.
- **Every protected admin API route must call `requireAdmin()` as its first statement** before reading the request body or touching the database.
- **All CMS and blog database access goes through `src/lib/supabase/cms.ts` or `src/lib/supabase/blog.ts`.** Do not write inline Supabase queries in route files.
- **Named exports only.** `export default` is reserved for Next.js page/layout/error files.
- **No `any` types.** Use `unknown` and narrow with a type guard, or define a proper interface.
- **No `console.log` in committed code** except inside `catch` blocks in API routes (where `console.error` is acceptable).
- **Image uploads must go through `POST /api/admin/upload`.** The response `url` is always an `images.arrow.taxi` proxy URL — store and display that, never the raw Cloudinary URL.
- **`'use client'`** is required on any component that uses React hooks, browser APIs, or event handlers.
- **AI streaming routes** must use `streamText` from `ai` and return `result.toTextStreamResponse()` — do not buffer and return JSON.
- **Prettier config:** single quotes, 2-space indent, 100-char print width, trailing commas ES5. Run `npm run format` before committing.
- **Branching:** only `dev` and `main`. No feature branches. Work on `dev`, merge to `main` when ready.

## Environment variables

```
# External backend (public site booking/vehicles)
NEXT_PUBLIC_BACKEND_URL=

# Google Maps (public site)
NEXT_PUBLIC_MAP_API_KEY=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Admin session (iron-session)
SESSION_SECRET=          # min 32 chars, random

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Anthropic (AI routes)
ANTHROPIC_API_KEY=
```

## Current task

[Fill in at the start of each session]
