import { supabaseAdmin } from './client';
import { isSupportedIcon, type SocialIcon, type SupportedSocialIcon } from '@/lib/social-icons';

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
  // FK on cms_sections.page_id has no ON DELETE CASCADE, so remove children first
  // or the page delete fails silently in Supabase.
  const { data: page, error: findError } = await supabaseAdmin
    .from('cms_pages')
    .select('id')
    .eq('slug', slug)
    .single();
  if (findError) {
    if (findError.code === 'PGRST116') return;
    throw findError;
  }
  const { error: sectionsError } = await supabaseAdmin
    .from('cms_sections')
    .delete()
    .eq('page_id', page.id);
  if (sectionsError) throw sectionsError;
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

// Icon slug list and types live in `@/lib/social-icons` so client components
// can import them without pulling in `supabaseAdmin`. Re-exported here for
// existing server-side callers.
export {
  SUPPORTED_SOCIAL_ICONS,
  isSupportedIcon,
  type SupportedSocialIcon,
  type SocialIcon,
} from '@/lib/social-icons';

function parseSocialIcons(raw: string | null): SocialIcon[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const out: SocialIcon[] = [];
    for (const entry of parsed) {
      if (
        entry &&
        typeof entry === 'object' &&
        'icon' in entry &&
        'url' in entry &&
        isSupportedIcon((entry as { icon: unknown }).icon) &&
        typeof (entry as { url: unknown }).url === 'string'
      ) {
        out.push({
          icon: (entry as { icon: SupportedSocialIcon }).icon,
          url: (entry as { url: string }).url,
        });
      }
    }
    return out;
  } catch {
    return [];
  }
}

export async function getSocialIcons(): Promise<SocialIcon[]> {
  const raw = await getSiteSetting('social_icons');
  return parseSocialIcons(raw);
}

export async function setSocialIcons(icons: SocialIcon[]): Promise<void> {
  // Filter to supported icons and drop entries with an empty URL so the admin
  // can't persist icon slugs the renderer has no SVG for.
  const clean = icons.filter(
    (i) => isSupportedIcon(i.icon) && typeof i.url === 'string' && i.url.trim().length > 0
  );
  await setSiteSetting('social_icons', JSON.stringify(clean));
}

// All cms_pages rows count as "main pages" for the cap — published, draft, or
// header-hidden alike. Cap is on total rows that exist, not visibility.
export async function countPages(): Promise<number> {
  const { count, error } = await supabaseAdmin
    .from('cms_pages')
    .select('*', { count: 'exact', head: true });
  if (error) throw error;
  return count ?? 0;
}

export const MAX_MAIN_PAGES = 6;

export async function listAllPages(): Promise<CmsPage[]> {
  const { data, error } = await supabaseAdmin
    .from('cms_pages')
    .select('*, cms_sections(*)')
    .order('title');
  if (error) throw error;
  return (data ?? []).map((p) => ({
    ...p,
    sections: ((p.cms_sections ?? []) as CmsSection[]).sort((a, b) => a.sort_order - b.sort_order),
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
