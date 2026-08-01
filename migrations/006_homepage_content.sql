-- ============================================================
-- Arrow Taxi CMS — homepage_content table
-- Apply after 004_blog_posts_h1.sql via Supabase dashboard.
-- Stores each editable homepage field as a stable key/value row.
-- ============================================================

create table if not exists homepage_content (
  key        text primary key,
  value      text,
  updated_at timestamptz default now()
);

-- Reuse the set_updated_at() trigger function from 001_cms_schema.sql
drop trigger if exists homepage_content_updated_at on homepage_content;
create trigger homepage_content_updated_at
  before update on homepage_content
  for each row execute function set_updated_at();

alter table homepage_content disable row level security;

-- Seed with the values that are currently hardcoded in src/app/page.tsx
insert into homepage_content (key, value) values
  ('hero_heading',          'Bangor''s Trusted Taxi Service'),
  ('hero_subtext',          'Professional, reliable rides across North Wales — available 24/7.'),
  ('hero_cta_label',        'Book a taxi now'),
  ('hero_background_image', '/Assets/Images/homeBgWave.png'),
  ('meta_title',            'Bangor Taxi - Top Rated North Wales Taxi Service'),
  ('meta_description',      'Call us on 01248209393 to book your taxi. We are based in Bangor, Gwynedd and operate 24/7. Snowdon, Tryfan, Beddgelert, Pwllheli, Caernarfon, Anglesey. To and from all major airports'),
  ('og_image_url',          'https://www.arrow.taxi/Assets/Images/BannerImg.jpeg'),
  ('phone_number',          '+441248209393')
on conflict (key) do nothing;
