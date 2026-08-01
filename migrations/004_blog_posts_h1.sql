-- ============================================================
-- Arrow Taxi CMS — Blog H1 field
-- Apply manually in Supabase Studio (SQL Editor).
-- ============================================================

ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS h1 text;
