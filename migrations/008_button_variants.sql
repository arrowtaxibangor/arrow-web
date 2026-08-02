-- ============================================================
-- Arrow Taxi CMS — button_variants table
-- Apply after 007_preview_drafts.sql via Supabase dashboard.
-- Stores editable button styles per variant (primary-gold etc.).
-- cms_sections gains a button_variant_slug FK so each BUTTON
-- section can reference a named variant instead of hardcoded style.
-- ============================================================

-- Reuse the set_updated_at() trigger function from 001_cms_schema.sql

create table if not exists button_variants (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  label         text not null,
  bg_color      text not null default '#FEC601',
  text_color    text not null default '#ffffff',
  font_size     int  not null default 18,
  border_radius int  not null default 12,
  padding_x     int  not null default 40,
  padding_y     int  not null default 16,
  font_weight   int  not null default 700,
  is_default    boolean not null default false,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

drop trigger if exists button_variants_updated_at on button_variants;
create trigger button_variants_updated_at
  before update on button_variants
  for each row execute function set_updated_at();

alter table button_variants disable row level security;

-- Seed the primary gold variant, picking up values already stored in
-- site_settings (cta_bg_color / cta_text_color / cta_font_size) when present.
insert into button_variants (slug, label, bg_color, text_color, font_size, border_radius, padding_x, padding_y, font_weight, is_default)
select
  'primary-gold',
  'Primary Gold CTA',
  coalesce((select value from site_settings where key = 'cta_bg_color'), '#FEC601'),
  coalesce((select value from site_settings where key = 'cta_text_color'), '#ffffff'),
  coalesce((select value::int from site_settings where key = 'cta_font_size'), 18),
  12,
  40,
  16,
  700,
  true
on conflict (slug) do nothing;

-- Add button_variant_slug column to cms_sections.
-- ON UPDATE CASCADE keeps section rows in sync if a variant slug is renamed.
-- ON DELETE SET NULL degrades gracefully if a variant is deleted.
alter table cms_sections
  add column if not exists button_variant_slug text
    references button_variants(slug)
    on update cascade
    on delete set null;

-- Data migration: point all existing BUTTON sections at primary-gold.
update cms_sections
  set button_variant_slug = 'primary-gold'
  where type = 'BUTTON'
    and button_variant_slug is null;
