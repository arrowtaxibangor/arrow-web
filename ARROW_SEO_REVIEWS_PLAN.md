# ARROW_SEO_REVIEWS_PLAN.md

## Known context

Google Reviews integration is currently broken in production because `GOOGLE_PLACES_API_KEY` and `GOOGLE_PLACE_ID` are missing from Vercel's Environment Variables. These must be added under Settings > Environment Variables and the project redeployed before Subtask A can be verified end-to-end. If they're still missing when this plan runs, implement the code anyway (it should degrade gracefully with them absent) and flag it clearly in the final report.

## Global constraints (apply to every subtask)

- Stack: Next.js App Router, deployed on Vercel, content/CMS on self-hosted Supabase (db.arrow.taxi).
- No direct DB access or migrations without producing a reviewable migration file first, nothing runs directly against Supabase.
- Brand colors: primary #265EA6 (blue), accent #FEC601 (gold). New UI must match existing shadcn/ui component library conventions.
- Never hardcode a fallback rating, review count, or testimonial. If a live data fetch fails, degrade gracefully (hide the section, omit the schema block), never fabricate data. This is the exact bug being fixed and must not be reintroduced.
- All new metadata (title, description, OG, canonical) generated per-route/per-slug dynamically where the page is dynamic (CMS pages, blog posts), never one hardcoded value copy-pasted across routes.

## Subtasks (build in this order, each independently reviewable)

**A. Google Places API fetch + cache layer**
`lib/googlePlaces.ts`, cached `fetchPlaceDetails()` returning rating, review count, up to 5 reviews. Returns `null` gracefully on failure or missing env vars, logs error, never throws.

**B. Remove hardcoded fake rating fallback**
Find and remove the fake "5" rating fallback flagged in the pre-launch audit (Banner/Hero/trust-badge component). Wire to Subtask A's data. No static rating number should remain anywhere outside test/fixture files.

**C. AggregateRating JSON-LD schema**
`LocalBusiness` + `AggregateRating` JSON-LD on homepage (and any dedicated reviews page), sourced from Subtask A. Only renders with real data present.

**D. Testimonials component**
CMS-library-consistent component rendering up to 5 real reviews (author, star rating in accent gold, text, relative time), linking to Arrow's GBP reviews page. Default placement: homepage only, unless told otherwise. Hides gracefully with no reviews.

**E. sitemap.ts**
`app/sitemap.ts`, dynamically including static routes, all CMS `[slug]` pages from Supabase, all blog post slugs.

**F. robots.ts**
`app/robots.ts`, disallowing admin/API routes, pointing to the sitemap.

**G. Canonical tags**
`alternates.canonical` via `generateMetadata` across homepage, all CMS pages, all blog posts, contact, luxury.

**H. Title + meta description audit**
Confirm every route has a non-empty, keyword-relevant title/description (from CMS SEO fields or hardcoded per static route). Report pages with missing SEO fields rather than inventing copy.

**I. Custom 404 page**
`app/not-found.tsx`, branded, links back to home/book a ride/blog/contact.

**J. Image alt text audit**
Audit all `<Image>`/`<img>` usage. Confirm ImageField admin component requires alt text on upload. Confirm Tiptap blog editor handles alt text on inserted images.

**K. Open Graph tags**
`openGraph` metadata via Metadata API across all routes, `type: 'article'` for blog posts with `publishedTime`/`authors`.

**L. llms.txt**
Static `public/llms.txt`, brief markdown summary of Arrow Taxi, pointer to the sitemap.

## Explicitly excluded (flag to Amin, don't implement)

- Backlinks/off-page SEO (manual outreach task).
- hreflang tags (not applicable, single-market/single-language site).
- Re-indexation itself (consequence of the above, not code-completable directly).

## Final validation (run after all subtasks pass)

- `sitemap.xml` and `robots.txt` render correctly at their live URLs.
- Rich Results Test passes on homepage schema.
- Spot-check 3-4 CMS pages and 1-2 blog posts in Search Console's URL Inspection tool.
- Grep for the old hardcoded rating value to confirm it's fully gone.
- Final summary report: what's done, what's pending on Amin (env vars, testimonial placement confirmation, missing SEO copy flagged in Subtask H).
