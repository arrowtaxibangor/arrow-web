-- ============================================================
-- Arrow Taxi CMS — Phase 1 Schema + Seed
-- Apply manually in Supabase Studio (SQL Editor).
-- REVALIDATION_SECRET placeholder in BUTTON sections:
--   replace https://PLACEHOLDER_ICABBY_BOOKING_URL with the
--   real iCabby booking URL before running.
-- ============================================================

-- ──────────────────────────────────────────
-- TABLES
-- ──────────────────────────────────────────

create table if not exists writer_profiles (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  role           text,
  email          text,
  bio            text,
  avatar_url     text,
  twitter_handle text,
  linkedin_url   text
);

create table if not exists cms_pages (
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

create table if not exists cms_sections (
  id          uuid primary key default gen_random_uuid(),
  page_id     uuid references cms_pages(id) on delete cascade,
  sort_order  int not null,
  type        text not null check (type in ('HERO', 'TEXT', 'IMAGE', 'BUTTON', 'AD_CODE')),
  content     text,
  image_url   text,
  image_alt   text,
  button_text text,
  button_link text,
  html        text,
  created_at  timestamptz default now()
);

create index if not exists cms_sections_page_sort on cms_sections (page_id, sort_order);

create table if not exists blog_posts (
  id                   uuid primary key default gen_random_uuid(),
  title                text not null,
  slug                 text unique not null,
  excerpt              text,
  content              text,
  cover_image_url      text,
  author               text not null,
  author_role          text,
  writer_profile_id    uuid references writer_profiles (id),
  category             text check (
    category in ('Local Guide', 'Airport Tips', 'Snowdonia', 'News', 'Travel Tips')
  ),
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

create table if not exists blog_comments (
  id           uuid primary key default gen_random_uuid(),
  post_id      uuid references blog_posts (id) on delete cascade,
  author_name  text not null,
  author_email text not null,
  content      text not null,
  approved     boolean default false,
  created_at   timestamptz default now()
);

-- ──────────────────────────────────────────
-- updated_at TRIGGER
-- ──────────────────────────────────────────

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists cms_pages_updated_at on cms_pages;
create trigger cms_pages_updated_at
  before update on cms_pages
  for each row execute function set_updated_at();

drop trigger if exists blog_posts_updated_at on blog_posts;
create trigger blog_posts_updated_at
  before update on blog_posts
  for each row execute function set_updated_at();

-- ──────────────────────────────────────────
-- RLS POSTURE
-- RLS is disabled on all tables. Auth is enforced at the
-- Next.js API layer (iron-session in Phase 2). The service
-- role key is used server-side only and never exposed to
-- clients. Do not half-configure RLS without also switching
-- public reads to the anon key with explicit policies.
-- ──────────────────────────────────────────

alter table cms_pages       disable row level security;
alter table cms_sections    disable row level security;
alter table blog_posts      disable row level security;
alter table blog_comments   disable row level security;
alter table writer_profiles disable row level security;

-- ──────────────────────────────────────────
-- SEED DATA — 6 existing pages
-- is_in_header = false for pages already in static NavItems.
-- top-destinations is the exception: it is commented out of
-- NavItems and was served by the old dynamic-pages API.
-- ──────────────────────────────────────────

-- 1. Airport Transfers
insert into cms_pages (id, slug, title, meta_title, meta_description, meta_keywords, is_published, is_in_header, has_booking_button)
values (
  '00000000-0000-0000-0000-000000000001',
  'airport-transfers',
  'Airport Transfers',
  'Airport Transfers - Reliable 24/7 Airport Taxi',
  'Book your airport taxi from North Wales. We cover Liverpool, Manchester, Birmingham and all London airports. 24/7, on-time guaranteed.',
  'airport taxi north wales, manchester airport taxi, liverpool airport taxi, birmingham airport taxi, london airport taxi',
  true, false, true
)
on conflict (slug) do nothing;

insert into cms_sections (page_id, sort_order, type, content)
values (
  '00000000-0000-0000-0000-000000000001', 1, 'TEXT',
$$<h1>24/7 Airport Transfers from North Wales</h1>
<p>Flying soon? Whether it's Liverpool, <strong>Manchester, Birmingham, or any London Airport</strong>, Arrow Taxi makes sure you get there comfortably, on time, and at the best price in the area.</p>
<h3>Why Choose Arrow Taxi for Airport Transfers?</h3>
<ul>
<li><strong>24/7 Service</strong> – day or night, we've got you covered</li>
<li><strong>On-Time Pickups Guaranteed</strong> – never miss a flight</li>
<li><strong>Clean, Comfortable Cars</strong> – travel in style and comfort</li>
<li><strong>Professional Local Drivers</strong> – friendly and reliable</li>
<li><strong>Lowest Fares in the Area</strong> – quality service at unbeatable prices</li>
</ul>
<h3>Simple, Stress-Free Travel</h3>
<p>Whether you're flying out or arriving back, we provide smooth, direct transfers from your door to the terminal and back again.<br><strong>Call us today on 01248 20 93 93</strong> or <strong>book online</strong> in minutes!</p>$$
);

insert into cms_sections (page_id, sort_order, type, button_text, button_link)
values ('00000000-0000-0000-0000-000000000001', 2, 'BUTTON', 'Book Me', 'https://PLACEHOLDER_ICABBY_BOOKING_URL');


-- 2. Caernarfon Taxi
insert into cms_pages (id, slug, title, meta_title, meta_description, meta_keywords, is_published, is_in_header, has_booking_button)
values (
  '00000000-0000-0000-0000-000000000002',
  'caernarfon-taxi',
  'Caernarfon Taxi Service',
  'Caernarfon Taxi Service - Arrow Taxi',
  'Local taxi service in Caernarfon and Gwynedd. Tours to Caernarfon Castle, Snowdonia and beyond. Call 01248 20 93 93.',
  'caernarfon taxi, gwynedd taxi, caernarfon castle taxi, snowdonia taxi',
  true, false, true
)
on conflict (slug) do nothing;

insert into cms_sections (page_id, sort_order, type, content)
values (
  '00000000-0000-0000-0000-000000000002', 1, 'TEXT',
$$<h1>Caernarfon Taxi Service</h1>
<p>Exploring <strong>Caernarfon</strong> or planning a day out in Snowdonia? Arrow Taxi is your trusted local taxi company, providing fast, friendly, and reliable transport across Gwynedd and beyond.</p>
<h3>Discover Caernarfon with Arrow Taxi</h3>
<p>We'll take you to all the must-see attractions, including:</p>
<ul>
<li><strong>Caernarfon Castle</strong> – the world-famous UNESCO World Heritage Site</li>
<li><strong>Caernarfon Harbour &amp; Waterfront</strong> – perfect for a relaxing stroll</li>
<li><strong>Menai Strait &amp; Seiont River</strong> – scenic rides and boat trips</li>
<li><strong>Welsh Highland Railway</strong> – journey through breathtaking Snowdonia</li>
<li><strong>Snowdonia National Park</strong> – mountain hikes and scenic tours just minutes away</li>
<li><strong>Galeri Caernarfon Theatre &amp; Arts Centre</strong> – culture, music, and live shows</li>
<li><strong>Caernarfon Town Centre</strong> – shopping, cafés, and traditional pubs</li>
</ul>
<h3>Why Ride with Arrow Taxi?</h3>
<ul>
<li><strong>Local, trusted drivers</strong> who know Caernarfon inside out</li>
<li><strong>On-time pickups guaranteed</strong></li>
<li><strong>Perfect for tourists</strong> – station, hotel &amp; attraction transfers</li>
<li><strong>Affordable fares</strong> with no hidden costs</li>
<li><strong>Book in seconds</strong> – by phone or online</li>
</ul>
<h3>Your Caernarfon Adventure Starts Here</h3>
<p>From castle tours to Snowdonia day trips, Arrow Taxi makes sure you get where you need to be, safely and comfortably.<br><strong>Call 01248 20 93 93</strong> or <strong>book online today!</strong></p>$$
);

insert into cms_sections (page_id, sort_order, type, button_text, button_link)
values ('00000000-0000-0000-0000-000000000002', 2, 'BUTTON', 'Book Me', 'https://PLACEHOLDER_ICABBY_BOOKING_URL');


-- 3. Snowdon Taxi
insert into cms_pages (id, slug, title, meta_title, meta_description, meta_keywords, is_published, is_in_header, has_booking_button)
values (
  '00000000-0000-0000-0000-000000000003',
  'snowdon-taxi',
  'Snowdonia Taxi',
  'Snowdonia Taxi - Betws-y-Coed, Beddgelert, Porthmadog - Arrow Taxi',
  'Taxi from Bangor train station to Llanberis, Pen y Pass, Beddgelert, Betws-y-Coed and all of Snowdonia. Book online or call 01248 20 93 93.',
  'snowdonia taxi, llanberis taxi, bangor station taxi, pen y pass taxi, beddgelert taxi, betws y coed taxi',
  true, false, true
)
on conflict (slug) do nothing;

insert into cms_sections (page_id, sort_order, type, content)
values (
  '00000000-0000-0000-0000-000000000003', 1, 'TEXT',
$$<h1>Taxi Service from Bangor Train Station to Llanberis, Pen y Pass, Beddgelert, and Betws-y-Coed in Snowdonia</h1>
<h3>Fast, Friendly &amp; Dependable Transfers</h3>
<p>Arriving at <strong>Bangor Train Station</strong> and heading towards the stunning mountains of <strong>Snowdonia</strong>? Arrow Taxi is here to make your journey smooth and stress-free.</p>
<p>We provide private hire and taxi services to all key destinations, including:</p>
<ul>
<li>Aber Falls</li>
<li><strong>Llanberis</strong> – gateway to Snowdon mountain</li>
<li><strong>Pen y Pass</strong> – the starting point for famous hiking routes</li>
<li><strong>Beddgelert</strong> – a charming Welsh village full of history</li>
<li><strong>Betws-y-Coed</strong> – the picturesque "Gateway to Snowdonia"</li>
<li>Porthmadog</li>
<li>Pwllheli</li>
<li>Barmouth – an amazing seaside town</li>
</ul>
<h3>Why Choose Arrow Taxi?</h3>
<ul>
<li><strong>Direct pickups from Bangor railway station</strong> – no waiting, no hassle</li>
<li><strong>Perfect for hikers &amp; adventurers</strong> – including the Welsh 3000s &amp; 15 Peaks challenge</li>
<li><strong>Based in Llanberis</strong> – right in the heart of Snowdonia National Park</li>
<li><strong>Trusted local drivers</strong> with years of experience</li>
<li><strong>Easy booking</strong> – call or reserve online in minutes</li>
</ul>
<h3>Start Your Snowdonia Adventure the Right Way</h3>
<p>Whether you're here for a mountain trek, a weekend getaway, or simply exploring the breathtaking scenery, Arrow Taxi ensures you travel in comfort and on time.</p>
<p><strong>Call 01248 20 93 93</strong> or <strong>book online today</strong> to secure your ride.</p>
<p>Arrow Taxi – <strong>Your Journey to Snowdon Starts Here.</strong></p>$$
);

insert into cms_sections (page_id, sort_order, type, button_text, button_link)
values ('00000000-0000-0000-0000-000000000003', 2, 'BUTTON', 'Book Me', 'https://PLACEHOLDER_ICABBY_BOOKING_URL');


-- 4. Luxury Chauffeur
insert into cms_pages (id, slug, title, meta_title, meta_description, meta_keywords, is_published, is_in_header, has_booking_button)
values (
  '00000000-0000-0000-0000-000000000004',
  'luxury',
  'North Wales Luxury Chauffeur',
  'North Wales Luxury Chauffeur - Arrow Taxi',
  'Mercedes S-Class chauffeur service across Bangor and North Wales. Corporate travel, airport transfers, weddings and special occasions.',
  'luxury chauffeur north wales, mercedes s-class taxi, corporate taxi bangor, wedding chauffeur',
  true, false, true
)
on conflict (slug) do nothing;

insert into cms_sections (page_id, sort_order, type, content)
values (
  '00000000-0000-0000-0000-000000000004', 1, 'TEXT',
$$<h1>North Wales Luxury Chauffeur Service</h1>
<p>Experience the elegance of true luxury travel with our <strong>black Mercedes S-Class chauffeur service.</strong> Whether you're a business executive, a discerning traveler, or celebrating a special occasion, we deliver comfort, prestige, and reliability that sets us apart across <strong>Bangor and all of North Wales.</strong></p>
<h3>Why Travel With Us?</h3>
<ul>
<li><strong>Luxury Vehicle</strong> – Glide through every journey in our immaculate <strong>Mercedes S-Class</strong>, designed for ultimate comfort and style.</li>
<li><strong>Corporate Excellence</strong> – Discreet, professional, and reliable service for executives and VIPs.</li>
<li><strong>Special Occasions</strong> – Weddings, anniversaries, gala evenings, or private celebrations—make every moment unforgettable.</li>
<li><strong>24/7 Airport Transfers</strong> – Stress-free connections to and from all major UK airports.</li>
<li><strong>Guaranteed Punctuality</strong> – We pride ourselves on <strong>on-time pickups</strong> every single time.</li>
<li><strong>Best Value in North Wales</strong> – Premium service, delivered at the most competitive rates in the region.</li>
</ul>
<h3>Perfect For:</h3>
<ul>
<li>Corporate &amp; executive travel</li>
<li>Luxury airport transfers</li>
<li>Weddings &amp; special events</li>
<li>Private tours of North Wales</li>
</ul>$$
);

insert into cms_sections (page_id, sort_order, type, button_text, button_link)
values ('00000000-0000-0000-0000-000000000004', 2, 'BUTTON', 'Book Me', 'https://PLACEHOLDER_ICABBY_BOOKING_URL');


-- 5. Top Destinations
-- is_in_header = true: this page is commented out of static NavItems but
-- was presumably in the dynamic nav from the old backend.
insert into cms_pages (id, slug, title, meta_title, meta_description, meta_keywords, is_published, is_in_header, has_booking_button)
values (
  '00000000-0000-0000-0000-000000000005',
  'top-destinations',
  'Top Destinations',
  'Arrow Taxi — Top Destinations in North Wales',
  'Discover North Wales with Arrow Taxi. Private tours and sightseeing taxi services to Snowdon, Anglesey, Conwy, Llandudno and more.',
  'north wales top destinations, snowdon taxi tour, anglesey taxi, conwy taxi, llandudno taxi',
  true, true, true
)
on conflict (slug) do nothing;

insert into cms_sections (page_id, sort_order, type, content)
values (
  '00000000-0000-0000-0000-000000000005', 1, 'TEXT',
$$<h1>Top Destinations in North Wales</h1>
<h3>Snowdon, Anglesey, Conwy, Llandudno</h3>
<p>Private tours and sightseeing taxi services available throughout North Wales.</p>
<ul>
<li>Customized long-distance taxi options.</li>
</ul>$$
);

insert into cms_sections (page_id, sort_order, type, button_text, button_link)
values ('00000000-0000-0000-0000-000000000005', 2, 'BUTTON', 'Book Me', 'https://PLACEHOLDER_ICABBY_BOOKING_URL');


-- 6. Contact (metadata only)
-- The /contact/page.tsx dedicated route owns this UI.
-- No cms_sections: the CMS entry exists so the admin can manage SEO metadata.
insert into cms_pages (id, slug, title, meta_title, meta_description, meta_keywords, is_published, is_in_header, has_booking_button)
values (
  '00000000-0000-0000-0000-000000000006',
  'contact',
  'Contact Us',
  'Bangor Taxi - Reliable Gwynedd Taxi Service',
  'Call us on 01248209393 to book your taxi. We are based in Bangor, Gwynedd and operate 24/7. Snowdon, Tryfan, Beddgelert, Pwllheli, Caernarfon, Anglesey. To and from all major airports.',
  'bangor taxi, gwynedd taxi, north wales taxi contact',
  true, false, false
)
on conflict (slug) do nothing;
