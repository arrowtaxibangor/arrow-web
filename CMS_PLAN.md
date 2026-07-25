# Arrow Taxi — CMS + Blog System Plan

## Overview

Arrow Taxi is becoming a landing page + blog site. Bookings move entirely to iCabby (single "Book Me" button). The site's job is SEO traffic → iCabby conversions. Traffic is 15k now, targeting 50k in 4–6 weeks.

Everything is built around one rule: **visitors never touch the origin server**. Vercel serves cached HTML from the edge. Cloudflare serves cached images. The DO droplet (Supabase) only does work when content changes.

---

## Architecture

```
Visitor
  │
  ▼
Cloudflare (DNS proxy + image cache)
  │
  ▼
Vercel Edge (serves ISR-cached HTML for all pages)
  │  (on-demand revalidation only — no timed rebuilds)
  ▼
Next.js App (arrow.taxi)
  ├── /                  → Home (static, revalidated on CMS save)
  ├── /blog              → Blog index (ISR)
  ├── /blog/[slug]       → Blog posts (ISR)
  ├── /[slug]            → CMS pages (ISR)
  ├── /admin/**          → Admin panel (dynamic, auth-protected)
  └── /api/**            → API routes (CMS + blog + AI + revalidation)
           │
           ▼
  Self-hosted Supabase (DO droplet)
  ├── cms_pages          → All marketing pages
  ├── cms_sections       → Page content blocks
  ├── blog_posts         → Blog content
  ├── writer_profiles    → Author records
  └── blog_comments      → Reader comments (moderated)
```

### Cost table

| Layer | Role | Cost |
|---|---|---|
| Vercel (ISR) | Serves all page HTML from edge cache | $0 extra |
| Cloudflare | DNS proxy + image CDN | Free tier |
| Self-hosted Supabase | All content + image storage | $0 extra (reuses DO droplet disk) |
| Admin panel | Built into the same Next.js app | $0 extra |
| LLM (Claude API — direct Anthropic) | Content generation in admin only | Pay per use (pennies per session) |

---

## Supabase Schema

### `cms_pages` — every marketing page on the site

```sql
create table cms_pages (
  id                 uuid primary key default gen_random_uuid(),
  slug               text unique not null,
  title              text not null,
  meta_title         text,
  meta_description   text,
  meta_keywords      text,
  canonical_url      text,
  og_image_url       text,
  google_tag         text,
  is_published       boolean default false,
  is_in_header       boolean default false,
  has_booking_button boolean default true,
  created_at         timestamptz default now(),
  updated_at         timestamptz default now()
);
```

### `cms_sections` — ordered content blocks per page

```sql
create table cms_sections (
  id          uuid primary key default gen_random_uuid(),
  page_id     uuid references cms_pages(id) on delete cascade,
  sort_order  int not null,
  type        text not null check (type in ('HERO','TEXT','IMAGE','BUTTON','AD_CODE')),
  content     text,        -- TEXT sections
  image_url   text,        -- IMAGE sections
  image_alt   text,
  button_text text,        -- BUTTON sections
  button_link text,
  html        text,        -- AD_CODE / HERO sections (see XSS note below)
  created_at  timestamptz default now()
);

create index on cms_sections(page_id, sort_order);
```

> **Security — AD_CODE / raw HTML:** The `html` column and `content` column (Tiptap rich-text output) are rendered with `dangerouslySetInnerHTML`. Since only the single admin account writes these, the blast radius is limited — but if the admin account is ever compromised, it becomes arbitrary script injection on every visitor. Accepted risk given admin-only authorship. As a minimum, run all stored HTML through DOMPurify on render, or sanitize server-side with `sanitize-html` before saving. Document the decision explicitly so it isn't missed during a security audit.

### `blog_posts` — blog content

```sql
create table blog_posts (
  id                   uuid primary key default gen_random_uuid(),
  title                text not null,
  slug                 text unique not null,
  excerpt              text,
  content              text,
  cover_image_url      text,
  author               text not null,
  author_role          text,
  writer_profile_id    uuid references writer_profiles(id),
  category             text check (category in (
                         'Local Guide','Airport Tips','Snowdonia','News','Travel Tips'
                       )),
  tags                 text[],
  reading_time_minutes int,
  published            boolean default false,
  featured             boolean default false,
  meta_title           text,
  meta_description     text,
  views                int default 0,
  created_at           timestamptz default now(),
  updated_at           timestamptz default now()
);
```

### `writer_profiles` — reusable author records

```sql
create table writer_profiles (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  role           text,
  email          text,
  bio            text,
  avatar_url     text,
  twitter_handle text,
  linkedin_url   text
);
```

### `blog_comments` — moderated reader comments

```sql
create table blog_comments (
  id           uuid primary key default gen_random_uuid(),
  post_id      uuid references blog_posts(id) on delete cascade,
  author_name  text not null,
  author_email text not null,
  content      text not null,
  approved     boolean default false,
  created_at   timestamptz default now()
);
```

---

## API Routes

All routes live under `src/app/api/`. No external backend is involved for CMS operations.

### CMS Pages

| Method | Path | Auth | Purpose |
|---|---|---|---|
| `GET` | `/api/cms/pages` | Public | List published pages (nav/footer) |
| `POST` | `/api/cms/pages` | Admin | Create a new page |
| `GET` | `/api/cms/pages/[slug]` | Public | Fetch a page + its sections |
| `PUT` | `/api/cms/pages/[slug]` | Admin | Update page fields |
| `DELETE` | `/api/cms/pages/[slug]` | Admin | Delete page |
| `PUT` | `/api/cms/pages/[slug]/sections` | Admin | Replace entire sections array |
| `POST` | `/api/revalidate` | Secret key | Trigger on-demand ISR revalidation |

### Blog

| Method | Path | Auth | Purpose |
|---|---|---|---|
| `GET` | `/api/blog` | Public | List published posts |
| `POST` | `/api/blog` | Admin | Create post |
| `GET` | `/api/blog/[slug]` | Public | Fetch single post + writer |
| `PUT` | `/api/blog/[slug]` | Admin | Update post |
| `DELETE` | `/api/blog/[slug]` | Admin | Delete post |
| `POST` | `/api/blog/[slug]/view` | Public | Increment view counter |
| `GET` | `/api/blog/[slug]/comments` | Public / Admin | List comments |
| `POST` | `/api/blog/[slug]/comments` | Public | Submit comment |
| `PUT` | `/api/blog/[slug]/comments/[id]` | Admin | Approve / reject |
| `DELETE` | `/api/blog/[slug]/comments/[id]` | Admin | Delete |

### AI Assist

| Method | Path | Auth | Purpose |
|---|---|---|---|
| `POST` | `/api/ai/generate` | Admin | Generate section content from brief (streaming) |
| `POST` | `/api/ai/improve` | Admin | Rewrite / improve selected text (streaming) |
| `POST` | `/api/ai/seo` | Admin | Suggest meta title, description, keywords |

### Media

| Method | Path | Auth | Purpose |
|---|---|---|---|
| `POST` | `/api/media/upload` | Admin | Upload image to Supabase Storage, return URL |
| `DELETE` | `/api/media/[filename]` | Admin | Delete from storage |

---

## Data Access Layer

No component or route queries Supabase directly. All queries go through two files.

**`src/lib/supabase/cms.ts`**
- `listPublishedPages()` — for nav / footer
- `getPageBySlug(slug)` — with sections, ordered by `sort_order`
- `createPage(data)` / `updatePage(slug, data)` / `deletePage(slug)`
- `replacePageSections(pageId, sections[])` — atomic replace on save

**`src/lib/supabase/blog.ts`** (same proven design as RevenueLadder)
- `listBlogPosts(opts?)` — published-only for public, all for admin
- `getBlogPostWithWriter(slug)`
- `createBlogPost(data)` / `updateBlogPost(slug, data)` / `deleteBlogPost(slug)`
- `getBlogStats()` — dashboard stats
- Writer CRUD, Comment CRUD

> **RLS posture:** All API routes use the Supabase service role key, which bypasses row-level security entirely. This is intentional — auth is enforced at the Next.js API layer via iron-session, not at the DB layer. Do not half-configure RLS (e.g. enable it on some tables but not others) in a way that creates false confidence. Either disable RLS on all tables and rely solely on the API layer, or enable it fully and switch public routes to the anon key with explicit policies. Document whichever you choose.

---

## ISR Strategy — On-Demand Only

Remove all timed revalidation. Switch to on-demand only triggered by admin saves.

**`src/app/api/revalidate/route.ts`**
```ts
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { slug, type, secret } = await req.json();
  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (type === 'blog') {
    revalidatePath(`/blog/${slug}`);
    revalidatePath('/blog');
  } else {
    revalidatePath(`/${slug}`);
    revalidatePath('/');
  }
  return NextResponse.json({ revalidated: true });
}
```

All public pages use `export const revalidate = false`. Pages go live within seconds of an admin save. No 60-second lag, no runaway invocations.

> **Critical — dynamic params:** `revalidate = false` alone is not enough on dynamic `[slug]` routes. You must also export `dynamicParams = true` and `generateStaticParams`. Without this, any slug created after the last deploy will 404 until the next deploy — `revalidatePath` only works for paths Next.js already knows. With `dynamicParams = true`, an unknown slug renders on first request and is then cached. This is the single most likely thing to break in production.

---

## Images — Cloudflare in Front of Supabase Storage

```
Upload (admin panel)
  → POST /api/media/upload
  → Supabase Storage (DO droplet disk)
  → Returns public URL

Public image URL:
  https://images.arrow.taxi/<filename>
  (Cloudflare CNAME → Supabase Storage bucket)

Cache-Control: public, max-age=31536000 on storage responses
First request: Cloudflare miss → pulls from storage → caches at edge
All subsequent: served from Cloudflare edge, droplet never touched
```

Do **not** use Cloudflare Images (paid). Free Cloudflare proxy + cache headers is sufficient.

Compress all images to 100–300 KB before upload — handled in the admin upload flow using `sharp` server-side.

> **Cloudflare bucket must be public:** The Supabase Storage bucket for public images must have public read access. If objects are private, Supabase returns 403s — and Cloudflare will cache those 403s, meaning images stay broken even after you fix the bucket policy. Set the bucket to public and verify `Cache-Control: public, max-age=31536000` is present on the storage response headers before putting Cloudflare in front.

---

## Public Frontend Pages

### Home — `/`

Server Component. Fetches the `home` slug from `cms_pages` + `cms_sections`. Renders sections via `CmsPageRenderer`. Always shows the Book Me hero regardless of CMS config.

### CMS Pages — `/[slug]`

```ts
export const revalidate = false;
export const dynamicParams = true; // render unknown slugs on first request, then cache

export async function generateStaticParams() {
  // pre-build all known slugs at deploy time
  const pages = await listPublishedPages();
  return pages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const page = await getPageBySlug(params.slug);
  return { title: page?.meta_title ?? page?.title, description: page?.meta_description };
}

export default async function Page({ params }) {
  const page = await getPageBySlug(params.slug);
  if (!page?.is_published) notFound();
  return <CmsPageRenderer page={page} />;
}
```

Same pattern applies to `/blog/[slug]` — `generateStaticParams` pre-builds known posts, `dynamicParams = true` handles posts inserted by n8n after the last deploy.

### Blog Index — `/blog`

Server Component. Lists published posts, maps via `mapDbPost()`, passes to client component for category filter tabs. `revalidate = false`.

### Blog Post — `/blog/[slug]`

Server Component. Fetches post + writer + approved comments + related posts. Injects `BlogPosting` JSON-LD. Includes `<ViewTracker>` client component for fire-and-forget view count.

> **View counter and stale cache:** `POST /api/blog/[slug]/view` increments `views` in Postgres on each page load. This does not affect the cached HTML — the write happens client-side and is invisible to the ISR layer. However, do not render the `views` value inside the statically cached page template. If you do, every visitor sees the view count frozen at whatever it was when the page last revalidated. Either display `views` via a separate client-side fetch after page load, or accept that the displayed count is as old as the last admin save.

---

## Admin Panel

Protected by middleware — any unauthenticated `/admin/*` request redirects to `/admin/login`.

**Auth:** Single admin account. `ADMIN_EMAIL` + `ADMIN_PASSWORD_HASH` (bcrypt) in env vars. Session managed via `iron-session`.

> **iron-session config:** `SESSION_SECRET` must be 32+ random characters. The session cookie must be set with `secure: true`, `httpOnly: true`, and `sameSite: 'lax'`. Without these flags, the session cookie is readable by JS (XSS escalation) and transmittable over plain HTTP.

### Routes

```
/admin                       → Dashboard (stats: pages, posts, views, pending comments)
/admin/pages                 → CMS pages list
/admin/pages/new             → Create page
/admin/pages/[id]            → Edit page (section editor + meta + tags + Google tag)
/admin/blog                  → Blog posts list
/admin/blog/new              → Create blog post
/admin/blog/[slug]           → Edit blog post
/admin/blog/comments         → Comment moderation queue
/admin/writers               → Writer profiles CRUD
/admin/media                 → Image library (Supabase Storage browser)
/admin/settings              → Global settings (GTM ID, default meta)
/admin/login                 → Login page
```

### CMS Page Editor — Fields

Right sidebar:
- **Title** — page display title
- **Slug** — URL segment, auto-generated from title, editable
- **Meta Title** — `<title>` tag override
- **Meta Description** — `<meta name="description">`
- **Meta Keywords**
- **Canonical URL**
- **OG Image** — paste URL or upload
- **Google Tag** — per-page GTM snippet or GA4 measurement ID
- **Show in header nav** — toggle
- **Show Book Me button** — toggle
- **Published** — toggle; saving as published triggers revalidation

### CMS Page Editor — Sections

Main area:
- Drag-to-reorder sections (saves on drop)
- **Add Section** button → type picker: TEXT / IMAGE / BUTTON / AD_CODE / HERO
- Per section inline editor:
  - TEXT → Tiptap rich text editor (output HTML sanitized before save)
  - IMAGE → URL input + upload button + alt text field
  - BUTTON → button text + link URL
  - AD_CODE → raw HTML textarea (admin-only; XSS risk accepted and documented above)
- Save all → `PUT /api/cms/pages/[slug]/sections` → revalidation ping

### Blog Post Editor

Matches RevenueLadder's `BlogPostForm`, adapted for Arrow Taxi categories:
- Title → auto-generates slug until manually edited
- Live URL preview: `arrow.taxi/blog/<slug>`
- Rich text editor (Tiptap) for content
- Excerpt, cover image, category, reading time
- Writer profile selector (auto-fills author + role)
- Author name + role (free text, editable independently)
- Meta title + description
- Published + Featured toggles
- Delete with confirmation dialog

---

## LLM Integration

AI assist lives **only in the admin panel**. It never writes directly to published pages — admin always reviews before saving.

### Three modes

**1. Generate Section Content**

Admin clicks "Generate with AI" on a TEXT section. Side panel asks:
- Topic / brief (e.g. "Why choose Arrow Taxi for airport transfers")
- Tone: Professional / Friendly / SEO-optimised
- Length: Short / Medium / Long

Calls `POST /api/ai/generate`. Streams HTML output into the Tiptap editor. Admin edits freely before saving.

**2. Improve Selected Text**

Admin selects text in the rich editor → "Improve with AI" appears. Dropdown:
- Make clearer
- Make more concise
- Make more persuasive
- Fix grammar

Calls `POST /api/ai/improve` with selected text + instruction. Streams replacement.

**3. SEO Assist**

Admin clicks "Generate SEO" in the sidebar. Reads the current title + first TEXT section. Calls `POST /api/ai/seo`. Returns suggested `meta_title`, `meta_description`, `meta_keywords`. Admin accepts each independently.

### Model — direct Anthropic API

```ts
import { anthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';

const result = await streamText({
  model: anthropic('claude-sonnet-5'),
  prompt: buildPrompt(input),
});
```

Uses `ANTHROPIC_API_KEY` from env. No gateway. Install `@ai-sdk/anthropic` alongside `ai`.

---

## n8n — Automated Blog Posts

n8n writes directly to `blog_posts` via Supabase REST API authenticated with the service role key. No custom webhook needed in Next.js.

After inserting, n8n adds one final step: `POST /api/revalidate` with `{ slug, type: 'blog', secret }`. The post is live within seconds.

> **Service role key security:** The service role key bypasses all RLS and is effectively god-mode on your database. Keep it only in n8n's credential store (never in any client-side code or public repo). Ensure `db.arrow.taxi` is HTTPS-only (it is). Ideally restrict which IPs can reach the Supabase REST endpoint — either via Kong config or by putting the endpoint behind Cloudflare Access. One leak of this key = full database compromise.

Minimal n8n payload:
```json
{
  "title": "10 Best Destinations from Bangor by Taxi",
  "slug": "best-destinations-bangor-taxi",
  "content": "<p>Full HTML...</p>",
  "author": "Arrow Taxi",
  "category": "Local Guide",
  "excerpt": "One sentence summary.",
  "reading_time_minutes": 5,
  "published": true,
  "featured": false
}
```

---

## Migration Path

### Phase 1 — Supabase + API foundation

1. Set up `cms_pages`, `cms_sections`, `blog_posts`, `writer_profiles`, `blog_comments` tables in self-hosted Supabase
2. Seed `cms_pages` + `cms_sections` with the current hardcoded content from the 6 named pages (airport-transfers, caernarfon-taxi, snowdon-taxi, luxury, top-destinations, contact)
3. Build `src/lib/supabase/cms.ts` and `src/lib/supabase/blog.ts`
4. Build all API routes under `/api/cms/` and `/api/blog/`
5. Build `/api/revalidate`
6. Switch `[slug]/page.tsx` to use new `getPageBySlug` from Supabase (replacing old external backend call), add `dynamicParams = true` and `generateStaticParams`
7. Update `PageLinksFetcher` to call `/api/cms/pages` instead of `/cms/pages/page-links`
8. Set `revalidate = false` on all public pages

### Phase 2 — Admin panel

1. Build `/admin/login` + middleware auth
2. Build `/admin` dashboard
3. Build `/admin/pages` list + section editor
4. Build `/admin/blog` list + post editor
5. Build `/admin/blog/comments` moderation
6. Build `/api/media/upload` + Supabase Storage integration
7. Wire every save to call `/api/revalidate`

### Phase 3 — Public blog

1. Build `/blog` index page
2. Build `/blog/[slug]` post page with JSON-LD, related posts, ViewTracker
3. Build `mapDbPost()` helper
4. Add blog to nav and footer

### Phase 4 — LLM

1. Build `/api/ai/generate`, `/api/ai/improve`, `/api/ai/seo`
2. Add "Generate with AI" panel to section editor
3. Add "Improve" button to Tiptap toolbar
4. Add "Generate SEO" button to fields sidebar

---

## Environment Variables

```env
# Supabase (self-hosted on DO droplet)
NEXT_PUBLIC_SUPABASE_URL=https://db.arrow.taxi
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...         # server-only, never expose client-side

# Admin auth
ADMIN_EMAIL=...
ADMIN_PASSWORD_HASH=...               # bcrypt hash
SESSION_SECRET=...                    # 32+ random chars; cookie: secure, httpOnly, sameSite=lax

# ISR
REVALIDATION_SECRET=...              # random string, used by /api/revalidate

# AI — direct Anthropic API
ANTHROPIC_API_KEY=...                # server-only, admin routes only

# Old backend — still required for Stripe / booking flow
# The CMS no longer calls this, but /bookings/success, /bookings/cancel,
# and /complete-booking/[id] still hit api-arrowtaxi.binarymarvels.com
NEXT_PUBLIC_BACKEND_URL=https://api-arrowtaxi.binarymarvels.com
NEXT_PUBLIC_MAP_API_KEY=...
```

---

## What Does NOT Change

- iCabby "Book Me" button on every page (label is "Book Me" — used consistently throughout)
- `/bookings/success` and `/bookings/cancel` Stripe pages — still call `NEXT_PUBLIC_BACKEND_URL`
- `/complete-booking/[id]` driver form — still calls `NEXT_PUBLIC_BACKEND_URL`
- `/contact` form (can migrate to CMS in Phase 1 or stay hardcoded)
- `/thank-you` page
- Header + footer structure — dynamic links switch from old `/cms/pages/page-links` to new `/api/cms/pages`
