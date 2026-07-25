# Blog Feature — Complete Technical Description

## Overview

The blog is a full-stack content publishing system built into the same Next.js application as the public marketing site. Posts are stored in Supabase, managed through a protected dashboard, and also publishable by automated n8n workflows that insert directly into the database. Any post with `published = true` is immediately live on the public site within 60 seconds.

---

## Database schema

Three Supabase tables power the blog.

### `blog_posts` — the primary content table

| Field                  | Type             | Purpose                                                                  |
| ---------------------- | ---------------- | ------------------------------------------------------------------------ |
| `id`                   | `uuid`           | Primary key, auto-generated                                              |
| `title`                | `text`           | Post title                                                               |
| `slug`                 | `text`           | Unique URL segment (`/blog/<slug>`)                                      |
| `excerpt`              | `text \| null`   | One-two sentence summary shown in listings                               |
| `content`              | `text`           | Full body HTML (rich text from the editor)                               |
| `cover_image_url`      | `text \| null`   | Absolute URL of the cover image (Supabase Storage or external)           |
| `author`               | `text`           | Display name of the author                                               |
| `author_role`          | `text \| null`   | Role line shown in the byline (e.g. "Lead engineer")                     |
| `writer_profile_id`    | `uuid \| null`   | FK to `writer_profiles`; when set, the writer's avatar and bio are shown |
| `category`             | `text \| null`   | One of: AI, Automation, Web Dev, SEO, Case Studies                       |
| `tags`                 | `text[] \| null` | Reserved; currently always null                                          |
| `reading_time_minutes` | `int \| null`    | Displayed as "X min read"                                                |
| `published`            | `boolean`        | `true` = visible on the public site                                      |
| `featured`             | `boolean`        | `true` = pinned at top of the blog listing                               |
| `meta_title`           | `text \| null`   | `<title>` tag; falls back to `title`                                     |
| `meta_description`     | `text \| null`   | `<meta description>`; falls back to `excerpt`                            |
| `views`                | `int`            | Incremented by the view-tracker on each page load                        |
| `created_at`           | `timestamptz`    | Auto-set on insert; used as the published date shown to readers          |
| `updated_at`           | `timestamptz`    | Bumped on every `updateBlogPost` call                                    |

### `writer_profiles` — reusable author records

| Field            | Type           | Purpose                                                  |
| ---------------- | -------------- | -------------------------------------------------------- |
| `id`             | `uuid`         | Primary key                                              |
| `name`           | `text`         | Display name                                             |
| `role`           | `text \| null` | Role line                                                |
| `email`          | `text \| null` | Internal only                                            |
| `bio`            | `text \| null` | Shown in the author bio block at the bottom of each post |
| `avatar_url`     | `text \| null` | Photo shown in byline and author bio                     |
| `twitter_handle` | `text \| null` | Linked from the author bio                               |
| `linkedin_url`   | `text \| null` | Linked from the author bio                               |

### `blog_comments` — reader comments with moderation gate

| Field          | Type      | Purpose                                                     |
| -------------- | --------- | ----------------------------------------------------------- |
| `id`           | `uuid`    | Primary key                                                 |
| `post_id`      | `uuid`    | FK to `blog_posts`                                          |
| `author_name`  | `text`    | Commenter's name                                            |
| `author_email` | `text`    | Collected but not displayed publicly                        |
| `content`      | `text`    | Comment body                                                |
| `approved`     | `boolean` | Defaults to `false`; only approved comments render publicly |

---

## Data access layer

All queries go through `src/lib/supabase/blog.ts` — no component or route queries Supabase directly. The file exports:

- `listBlogPosts(opts?)` — returns all posts, or published-only when `publishedOnly: true`
- `getBlogPost(slug)` — single post by slug
- `getBlogPostWithWriter(slug)` — joins `writer_profiles` in a single query
- `createBlogPost(insert)` — inserts a new post
- `updateBlogPost(slug, updates)` — patches by slug, auto-sets `updated_at`
- `deleteBlogPost(slug)` — hard delete
- `getBlogStats()` — published count, draft count, total views, pending comment count, top 5 posts by views
- Writer CRUD: `listWriters`, `getWriter`, `createWriter`, `updateWriter`, `deleteWriter`
- Comment functions: `listComments`, `listAllCommentsWithPost`, `createComment`, `updateComment`, `deleteComment`

The `mapDbPost()` helper in `src/lib/blog-data.ts` converts a raw `DbBlogPost` row into the `BlogPost` display type: it derives `catId` (URL-safe slug of the category), `catTone` (gold for AI/Case Studies, default for others), author initials, a formatted date string, and placeholder glyph text for posts without cover images.

---

## REST API routes

All routes live under `src/app/api/blog/`.

| Method   | Path                             | Auth                                   | Purpose                     |
| -------- | -------------------------------- | -------------------------------------- | --------------------------- |
| `GET`    | `/api/blog`                      | Public                                 | List all posts              |
| `POST`   | `/api/blog`                      | Session required                       | Create a post               |
| `GET`    | `/api/blog/[slug]`               | Public                                 | Fetch a single post         |
| `PUT`    | `/api/blog/[slug]`               | Session required                       | Update a post               |
| `DELETE` | `/api/blog/[slug]`               | Session required                       | Delete a post               |
| `GET`    | `/api/blog/[slug]/comments`      | Public (approved only) / Session (all) | List comments               |
| `POST`   | `/api/blog/[slug]/comments`      | Public                                 | Submit a comment            |
| `PUT`    | `/api/blog/[slug]/comments/[id]` | Session required                       | Approve or reject a comment |
| `DELETE` | `/api/blog/[slug]/comments/[id]` | Session required                       | Delete a comment            |
| `POST`   | `/api/blog/[slug]/view`          | Public                                 | Increment view counter      |

Every route validates its request body as `unknown` before narrowing, wraps all logic in `try/catch`, and returns typed `NextResponse.json` responses.

The view counter route (`/view`) uses the admin Supabase client (service role key) so it can write without a user session. It only increments if the post exists and is published.

---

## Public frontend

### Blog index — `/blog`

`src/app/(public)/blog/page.tsx`

A React Server Component that fetches all published posts at build/request time, maps them through `mapDbPost`, and derives the category counts dynamically from the live post set. It delegates rendering to `BlogIndexClient`, which is a client component handling the category filter tabs and animated card grid. Revalidation is set to 60 seconds (`export const revalidate = 60`), so new posts appear within a minute without a full redeploy.

### Blog post — `/blog/[slug]`

`src/app/(public)/blog/[slug]/page.tsx`

Also a Server Component with `revalidate = 60`. On each request it:

1. Fetches the post joined with its writer profile (`getBlogPostWithWriter`)
2. Fetches all published posts to derive related posts (same category first, then others, capped at 3) and the live category sidebar list
3. Fetches approved comments for the post

The page renders a `<ViewTracker>` client component as the first element. That component fires a `POST /api/blog/[slug]/view` call client-side on mount — invisible to the user, increments the counter in the background.

Content is rendered via `dangerouslySetInnerHTML` since the `content` field stores HTML from the rich editor.

The page injects a `BlogPosting` JSON-LD schema block and sets canonical `<meta>` tags using `generateMetadata`, which reads `meta_title` and `meta_description` with fallbacks to `title` and `excerpt`.

The sidebar has a CTA card ("Book a 30-min call") linking to Calendly, a related posts list, and a category filter list.

---

## Dashboard

All dashboard pages live under `src/app/dashboard/blog/` and are protected by middleware — any unauthenticated request redirects to `/`.

### Post list — `/dashboard/blog`

Server component. Renders a table of all posts (published and draft) showing title, slug, category badge, author, view count, and publish status badge. Each row has "View" (published posts only, opens public URL) and "Edit" action buttons.

### New post — `/dashboard/blog/new`

Loads the writer profiles list server-side, then renders `BlogPostForm` with no initial post — creating mode.

### Edit post — `/dashboard/blog/[slug]`

Loads the post and writer profiles in parallel, passes both to `BlogPostForm` — editing mode.

### `BlogPostForm` — `src/components/dashboard/BlogPostForm.tsx`

Client component. This is the core authoring UI. Fields:

- Title (auto-generates slug on change until the user touches the slug field manually)
- Slug (editable, shows a live URL preview: `revenueladder.co.uk/blog/<slug>`)
- Excerpt
- Content (via `RichEditor`)
- Meta title and meta description
- Cover image — paste a URL or click upload; upload hits `/api/upload` and stores in Supabase Storage, the returned URL populates the field
- Category dropdown (AI, Automation, Web Dev, SEO, Case Studies)
- Reading time (minutes)
- Writer profile selector — choosing a profile auto-populates the author name and role fields
- Author display name and role (free text, editable independently of the profile)
- Published toggle
- Featured toggle

Saving calls `POST /api/blog` (create) or `PUT /api/blog/[slug]` (edit). On successful create, the router navigates to the edit page for the new slug. Toasts confirm success or surface error messages. Delete requires a confirmation dialog, then calls `DELETE /api/blog/[slug]` and redirects back to the list.

### Comments — `/dashboard/blog/comments`

Lists every comment across all posts with the post title and slug. Rendered by `CommentModerationTable` (client component) which allows inline approve/reject/delete without a page reload.

---

## n8n automated blog posts

There is no custom webhook endpoint in the Next.js application for n8n. Instead, n8n writes directly to the `blog_posts` Supabase table using the Supabase REST API (or the Supabase node in n8n) authenticated with the service role key.

The minimal payload n8n must send to publish a post immediately:

```json
{
  "title": "Post title",
  "slug": "post-slug",
  "content": "<p>Full HTML body...</p>",
  "author": "Catrin Jenkins",
  "author_role": "Head of content · Bangor",
  "category": "AI",
  "excerpt": "One sentence summary.",
  "reading_time_minutes": 6,
  "published": true,
  "featured": false,
  "cover_image_url": "https://...",
  "meta_title": null,
  "meta_description": null,
  "writer_profile_id": null,
  "tags": null
}
```

Setting `published: true` in the insert means the post is live immediately — no manual approval step in the dashboard. Because the public pages use ISR with `revalidate = 60`, the post appears on `/blog` and is accessible at `/blog/<slug>` within 60 seconds of the Supabase insert without any redeploy.

If the n8n workflow needs to keep a post in draft first and publish later, it inserts with `published: false` and then issues an update with `published: true` when ready.

---

## Rendering strategy summary

| Layer               | Strategy                         | Why                                                |
| ------------------- | -------------------------------- | -------------------------------------------------- |
| `/blog` index       | ISR, 60 s revalidate             | New posts surface quickly; no SSG rebuild needed   |
| `/blog/[slug]` post | ISR, 60 s revalidate             | Same; writer profile joins update without redeploy |
| Dashboard pages     | Dynamic (always server-rendered) | Always shows current state of drafts               |
| Comment list        | Dynamic                          | Must reflect moderation actions instantly          |
| View counter        | Client-side fire-and-forget      | Does not block page render                         |
