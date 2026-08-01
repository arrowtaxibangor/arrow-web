# Blog Section UI Description

A complete description of the blog listing page, article page, and all supporting components.

---

## 1. Blog Listing Page (`/blog`)

### 1.1 Hero Section

Full-width section with a subtle gradient wash background.

**Layout:** Max-width 1280px, centred. Two columns side by side (flex, items aligned to bottom), wrapping on small screens.

**Left column (max 640px wide):**

- Small all-caps eyebrow label above the heading (e.g. "Aronix Blog") -- monospace font, subdued colour, light letter-spacing.
- Large display heading, font-weight 800, fluid size clamped between 40px and 64px, tight line-height (1.06), strong negative letter-spacing (-0.025em).
- Subheading paragraph at 18px, slightly muted colour, max 480px wide, relaxed line-height (1.6).

**Right column (shrink-0, text-right):**

- Only shown when there is at least one published post.
- A large number (52px, weight 800, tight tracking) showing total post count.
- Below it, a small mono-font all-caps label: "Article published" / "Articles published".

**Top padding:** 144px (accounts for fixed nav). Bottom padding: 64px.

---

### 1.2 Category Filter Bar

A horizontal scrollable/wrapping row of pill links, shown between the hero and the post grid.

- Pills are rounded-full buttons with a 14px medium-weight label.
- **Inactive pill:** white background, muted border, muted text. On hover border darkens and text brightens.
- **Active pill:** dark fill (near-black), white text, matching border.
- "All" pill always appears first; the rest are derived from categories present in published posts.
- Clicking a category appends `?category=<name>` to the URL; "All" links back to `/blog` with no query param.
- Bottom margin of ~48px before the post grid.

---

### 1.3 Featured Post Card

Shown only on the unfiltered view when a featured post exists. Sits above the regular post grid.

**Shape:** Large card, 24px border radius, white background, single-pixel border. On hover a strong drop-shadow appears.

**Layout:** CSS grid, 1 column on mobile, 2 columns on desktop (content | image at 44% width).

**Content column (padding 40px mobile / 48px desktop, flex column, space-between):**

- Top badges row: dark "FEATURED" mono badge (10px, uppercase, 0.1em letter-spacing, dark bg, white text) + category pill side by side.
- Heading: display font, weight 800, fluid 24px--34px, line-height 1.15, tight tracking.
- Excerpt paragraph: 16px, muted colour, 1.7 line-height.
- Bottom row (flex, space-between, wrap-friendly):
  - Author avatar (40px coloured circle with initials) + author name (14px semibold) + formatted date and read time (12px, muted).
  - "Read article" outline button (small size).

**Image column:** Full-height cover image. If no image exists, a category-specific diagonal gradient fills the space instead (e.g. pink gradient for CRM, blue for Finance Ops, indigo for Internal Ops, grey-to-black for Strategy).

**Bottom margin:** ~48px before the regular grid.

---

### 1.4 Post Grid

A 1/2/3 column responsive grid (gap 24px) of standard post cards.

**Empty state:** Centred paragraph at 16px in muted colour -- different copy for "no posts in this category" vs "no posts yet".

---

### 1.5 Post Card (Standard)

White background, 16px border radius, single-pixel border, overflow hidden, flex column.

On hover: card lifts 3px and a large drop-shadow appears. Transition: 200ms ease-out.

**Top: cover image**

- 16:9 aspect ratio via percentage padding trick.
- If a cover image URL exists, renders a fill-mode Next.js Image.
- If no image, a diagonal gradient based on post category fills the placeholder.

**Body (24px padding, flex column, gap 12px, flex-1):**

- Category pill (self-start, aligned left).
- Post title: display font, weight 700, 18px, line-height 1.3, tight tracking. The whole title is a link.
- Excerpt: 14px, muted colour, 1.6 line-height. Fills remaining vertical space (flex-1).
- Footer row (border-top, 12px top padding):
  - Author avatar (28px coloured initials circle) + first name in medium weight + middle dot + formatted date.
  - Read time pushed to the right: 10px mono font, clock icon + duration string.

---

### 1.6 Newsletter Band (bottom of listing page)

Full-width dark section (dark gradient background), centred text.

- Large display heading in white, fluid 32px--50px, weight 800, tight tracking, max 580px wide.
- Subheading paragraph at 17px in a slightly translucent white.
- Below: inline subscribe form (email input + submit button), styled for the dark background.

---

## 2. Article Page (`/blog/[slug]`)

### 2.1 Article Header Section

Full-width section with a soft blush/warm-tinted background.

**Top padding:** 120px. Bottom padding: 48px.

**Content (max 1280px, centred):**

1. **Breadcrumb nav** (13px, muted colour, flex row, items-centre):
   - "Blog" text link (hover: darkens) + small ChevronRight icon (12px, 1.75 stroke) + category pill.

2. **Post title** (`<h1>`):
   - Display font, weight 800, fluid 32px--52px, line-height 1.1, strong negative tracking (-0.025em).
   - Max-width 840px. Bottom margin ~28px.

3. **Author row** (flex, items-centre, gap ~14px):
   - 42px coloured avatar with initials.
   - Two lines of text:
     - Author full name in semibold at 14px.
     - Date + middle dot + clock icon + read time, all at 13px in muted colour.

---

### 2.2 Cover Image Strip

Directly below the header section, still inside the max-1280px container.

- Cover image (or gradient fallback) with a minimum height of 380px.
- Border radius applied only to the bottom two corners (0 0 24px 24px), so it appears to "hang" below the header section seamlessly.
- Priority loading (LCP element).

---

### 2.3 Article Body (two-column layout)

Section with 56px top padding, 96px bottom padding.

**Grid:** Single column on mobile; on large screens: `1fr 292px` with 72px gap. Sidebar is sticky at 88px from top.

**Main column:**

1. **Excerpt lead paragraph** -- 19px, line-height 1.8, muted colour. Separated from the body by a bottom border and ~48px bottom padding.

2. **Rich text body** (`.article-prose` class, see prose styles below).

3. **CTA block** at the bottom of the article:
   - Soft blush background, 24px border radius, 1px border, 40px padding.
   - Small eyebrow label.
   - Bold display heading at 22px, weight 700.
   - Body paragraph at 15px, 1.65 line-height.
   - Primary button with trailing arrow.

**Sidebar (292px, sticky):**

1. **Author card** -- white background, 16px border radius, 1px border, 24px padding:
   - 44px avatar + author name (display font, 15px, semibold) + optional role label (12px, muted).

2. **Newsletter mini-card** -- dark gradient background, 16px border radius, 24px padding:
   - Heading in white at 16px, weight 700, line-height 1.3.
   - Short lead text at 13px in translucent white, 1.55 line-height.
   - Compact subscribe form (sidebar variant).

---

### 2.4 Related Posts Section

Shown only when at least one related post exists. Full-width section, soft blush background, 80px vertical padding.

**Header block (bottom margin ~40px):**

- Small eyebrow label ("Continue reading").
- Section heading: display font, weight 700, fluid 24px--32px, tight tracking.

**Grid:** Same 1/2/3 column responsive grid as the listing page, using the identical standard PostCard component.

---

## 3. Prose / Article Body Styles

Applied via `.article-prose` on the wrapping div around the rendered HTML content.

| Element      | Style                                                                                           |
| ------------ | ----------------------------------------------------------------------------------------------- |
| `h1`         | Display font, weight 800, fluid sizes, snug line-height, tight tracking, margin-top ~48px       |
| `h2`         | Same as h1 but slightly smaller                                                                 |
| `h3 / h4`    | Display font, weight 700, progressively smaller                                                 |
| `p`          | 24px bottom margin                                                                              |
| `a`          | Brand primary colour, underline, 3px offset. Hover darkens.                                     |
| `img`        | Full width, medium border radius, vertical margin.                                              |
| `code`       | Monospace, 0.88em, light grey background pill, 2px 6px padding, small border radius             |
| `pre`        | Dark surface background, light grey text, 24px padding, medium border radius, horizontal scroll |
| `pre code`   | Inherits pre; no extra background or padding                                                    |
| `blockquote` | 4px left border in brand primary colour, 24px left padding, italic, muted text colour           |
| `ul / ol`    | 24px left padding, 24px bottom margin                                                           |
| `li`         | 8px bottom margin                                                                               |
| `hr`         | No border, 1px top border in default border colour, large vertical margin                       |

---

## 4. Shared UI Elements

### Category Pill

A small inline badge used on cards and the article breadcrumb.

- 10px monospace font, uppercase, 0.08em letter-spacing.
- 10px 6px padding, 4px border radius (slightly square, not fully rounded).
- Colour-coded per category:
  - CRM Integration: light pink background, dark pink text, pink border.
  - Finance Ops: light blue background, dark blue text, sky border.
  - Internal Ops: light indigo background, deep indigo text, indigo border.
  - Strategy / default: light grey background, muted text, standard border.

### Avatar

A circular div with the author's initials (up to 2).

- Default size: 28px diameter. Article header: 42px. Author card sidebar: 44px. Featured card: 40px.
- Background colour is deterministically derived from the author's name (hash into a fixed palette of pink, blue, indigo, slate).
- Initials text is white, monospace, semibold.

### PostCover

A positioned container that renders a cover image or a category gradient fallback.

- Default aspect ratio: 16:9 (via percentage padding).
- When `minHeight` is provided (article page), uses min-height instead of the padding trick.
- Image: Next.js `<Image fill sizes="...">` with object-cover.
- Fallback gradient: diagonal 135deg, category-specific light-to-dark colour pair.
