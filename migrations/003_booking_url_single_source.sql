-- Arrow Taxi CMS — booking URL single source of truth
-- Apply manually via the Supabase SQL editor or the Supabase CLI.
--
-- CmsPageRenderer renders every BUTTON section using the booking URL resolved
-- from site_settings.booking_url. The per-section cms_sections.button_link
-- column is never read, but 001_cms_schema.sql seeded it with the same
-- PLACEHOLDER_ICABBY_BOOKING_URL string, leaving two apparent sources for one
-- value.
--
-- Clear the redundant column so site_settings.booking_url is unambiguously the
-- only place the booking URL lives.

update cms_sections
set button_link = null
where type = 'BUTTON';

-- Set the live iCabby booking URL below, or through Admin -> Settings:
--
--   update site_settings
--   set value = 'https://your-real-icabby-booking-url'
--   where key = 'booking_url';
--
-- Until that value is set, every booking button renders with href="#".
