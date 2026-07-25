import { supabaseAdmin } from './client';

export type SectionType = 'HERO' | 'TEXT' | 'IMAGE' | 'BUTTON' | 'AD_CODE';

export type CmsSection = {
  id: string;
  page_id: string;
  sort_order: number;
  type: SectionType;
  content: string | null;
  image_url: string | null;
  image_alt: string | null;
  button_text: string | null;
  button_link: string | null;
  html: string | null;
  created_at: string;
};

export type CmsPage = {
  id: string;
  slug: string;
  title: string;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  canonical_url: string | null;
  og_image_url: string | null;
  google_tag: string | null;
  is_published: boolean;
  is_in_header: boolean;
  has_booking_button: boolean;
  created_at: string;
  updated_at: string;
  sections?: CmsSection[];
};

export type CmsPageInput = Omit<CmsPage, 'id' | 'created_at' | 'updated_at' | 'sections'>;
export type CmsSectionInput = Omit<CmsSection, 'id' | 'page_id' | 'created_at'>;

export async function listPublishedPages(): Promise<
  Pick<CmsPage, 'id' | 'slug' | 'title' | 'is_published' | 'is_in_header'>[]
> {
  const { data, error } = await supabaseAdmin
    .from('cms_pages')
    .select('id, slug, title, is_published, is_in_header')
    .eq('is_published', true)
    .order('title');

  if (error) throw error;
  return data ?? [];
}

export async function getPageBySlug(slug: string): Promise<CmsPage | null> {
  const { data, error } = await supabaseAdmin
    .from('cms_pages')
    .select('*, cms_sections(*)')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return {
    ...data,
    sections: ((data.cms_sections ?? []) as CmsSection[]).sort(
      (a, b) => a.sort_order - b.sort_order
    ),
  };
}

export async function createPage(input: CmsPageInput): Promise<CmsPage> {
  const { data, error } = await supabaseAdmin.from('cms_pages').insert(input).select().single();

  if (error) throw error;
  return data;
}

export async function updatePage(slug: string, input: Partial<CmsPageInput>): Promise<CmsPage> {
  const { data, error } = await supabaseAdmin
    .from('cms_pages')
    .update(input)
    .eq('slug', slug)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deletePage(slug: string): Promise<void> {
  const { error } = await supabaseAdmin.from('cms_pages').delete().eq('slug', slug);
  if (error) throw error;
}

export async function getSiteSetting(key: string): Promise<string | null> {
  const { data, error } = await supabaseAdmin
    .from('site_settings')
    .select('value')
    .eq('key', key)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data?.value ?? null;
}

// Replaces all sections for a page in two steps (delete + insert).
// Not atomic — if the insert fails the sections will be empty.
// Phase 2: convert to a Postgres RPC function for true atomicity.
export async function replacePageSections(
  pageId: string,
  sections: CmsSectionInput[]
): Promise<CmsSection[]> {
  await supabaseAdmin.from('cms_sections').delete().eq('page_id', pageId);

  if (!sections.length) return [];

  const rows = sections.map((s, i) => ({ ...s, page_id: pageId, sort_order: i }));
  const { data, error } = await supabaseAdmin.from('cms_sections').insert(rows).select();

  if (error) throw error;
  return ((data ?? []) as CmsSection[]).sort((a, b) => a.sort_order - b.sort_order);
}

export async function setSiteSetting(key: string, value: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from('site_settings')
    .upsert({ key, value }, { onConflict: 'key' });
  if (error) throw error;
}

export async function listAllPages(): Promise<CmsPage[]> {
  const { data, error } = await supabaseAdmin
    .from('cms_pages')
    .select('*, cms_sections(*)')
    .order('title');
  if (error) throw error;
  return (data ?? []).map((p) => ({
    ...p,
    sections: ((p.cms_sections ?? []) as CmsSection[]).sort(
      (a, b) => a.sort_order - b.sort_order
    ),
  }));
}

export async function getPageById(id: string): Promise<CmsPage | null> {
  const { data, error } = await supabaseAdmin
    .from('cms_pages')
    .select('*, cms_sections(*)')
    .eq('id', id)
    .single();
  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return {
    ...data,
    sections: ((data.cms_sections ?? []) as CmsSection[]).sort(
      (a, b) => a.sort_order - b.sort_order
    ),
  };
}
