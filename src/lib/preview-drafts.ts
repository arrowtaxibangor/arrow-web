import { randomUUID } from 'crypto';
import { supabaseAdmin } from './supabase/client';
import type { CmsPageInput, CmsSectionInput } from './supabase/cms';
import type { HomepageContent } from './supabase/homepage';

const DRAFT_TTL_MS = 60 * 60 * 1000; // 60 minutes

export type PageDraftContent = {
  type: 'page';
  meta: CmsPageInput;
  sections: CmsSectionInput[];
};

export type BlogDraftContent = {
  type: 'blog';
  fields: {
    title: string;
    h1: string | null;
    slug: string;
    excerpt: string | null;
    content: string | null;
    cover_image_url: string | null;
    author: string;
    author_role: string | null;
    category: string | null;
    tags: string[] | null;
    reading_time_minutes: number | null;
    meta_title: string | null;
    meta_description: string | null;
    published: boolean;
    featured: boolean;
  };
};

export type HomepageDraftContent = {
  type: 'homepage';
  fields: HomepageContent;
};

export type DraftContent = PageDraftContent | BlogDraftContent | HomepageDraftContent;

export type SavedDraft = {
  token: string;
  type: 'page' | 'blog' | 'homepage';
  content: DraftContent;
  slug: string | null;
  expires_at: string;
  created_at: string;
};

export async function saveDraft(content: DraftContent, slug: string | null): Promise<string> {
  const token = randomUUID();
  const expiresAt = new Date(Date.now() + DRAFT_TTL_MS).toISOString();

  const { error } = await supabaseAdmin.from('cms_drafts').insert({
    token,
    type: content.type,
    content,
    slug,
    expires_at: expiresAt,
  });

  if (error) throw error;
  return token;
}

export async function getDraft(token: string): Promise<SavedDraft | null> {
  const { data, error } = await supabaseAdmin
    .from('cms_drafts')
    .select('*')
    .eq('token', token)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  if (new Date(data.expires_at) < new Date()) {
    await supabaseAdmin.from('cms_drafts').delete().eq('token', token);
    return null;
  }

  return data as SavedDraft;
}
