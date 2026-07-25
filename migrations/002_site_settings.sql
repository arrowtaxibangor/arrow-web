-- ============================================================
-- Arrow Taxi CMS — site_settings table
-- Apply after 001_cms_schema.sql.
-- Replace PLACEHOLDER_ICABBY_BOOKING_URL with the real URL
-- before running, or update the row in Studio afterward.
-- ============================================================

create table if not exists site_settings (
  key        text primary key,
  value      text,
  updated_at timestamptz default now()
);

-- Reuse the set_updated_at() function created in 001_cms_schema.sql
drop trigger if exists site_settings_updated_at on site_settings;
create trigger site_settings_updated_at
  before update on site_settings
  for each row execute function set_updated_at();

alter table site_settings disable row level security;

insert into site_settings (key, value)
values ('booking_url', 'https://PLACEHOLDER_ICABBY_BOOKING_URL')
on conflict (key) do nothing;


-- test