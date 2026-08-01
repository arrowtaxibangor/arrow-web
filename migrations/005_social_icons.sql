-- ============================================================
-- Arrow Taxi CMS — social icons setting
-- Apply after 002_site_settings.sql.
-- Stores the footer social-icon list as JSON in site_settings.
-- Value shape: [{ "icon": "facebook", "url": "https://..." }, ...]
-- Supported icon keys: facebook, whatsapp, instagram, youtube,
-- pinterest, twitter. Order in the array = display order.
-- ============================================================

insert into site_settings (key, value)
values (
  'social_icons',
  '[
    { "icon": "facebook",  "url": "https://www.facebook.com/ArrowBangorTaxi" },
    { "icon": "whatsapp",  "url": "https://wa.me/441248209393" },
    { "icon": "instagram", "url": "https://www.instagram.com/ArrowTaxiBangor" },
    { "icon": "youtube",   "url": "https://www.youtube.com/channel/UCC5gakSUeQOmv3W41GJ73CQ" },
    { "icon": "pinterest", "url": "https://uk.pinterest.com/ArrowBangorTaxi" },
    { "icon": "twitter",   "url": "https://x.com/ArrowTaxiBangor" }
  ]'
)
on conflict (key) do nothing;
