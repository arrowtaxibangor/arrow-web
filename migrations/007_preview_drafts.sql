-- ============================================================
-- Arrow Taxi CMS — preview drafts table
-- Apply after 006_homepage_content.sql via Supabase dashboard.
-- Stores ephemeral draft content for live-preview-before-publish.
-- Rows expire after 60 minutes and are cleaned up on read.
-- ============================================================

create table if not exists cms_drafts (
  token      text primary key,
  type       text not null check (type in ('page', 'blog', 'homepage')),
  content    jsonb not null,
  slug       text,
  expires_at timestamptz not null,
  created_at timestamptz default now()
);

alter table cms_drafts disable row level security;

-- Index lets you efficiently batch-delete expired rows if needed.
create index if not exists cms_drafts_expires_at on cms_drafts (expires_at);
