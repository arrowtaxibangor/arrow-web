import { supabaseAdmin } from './client';

export const HOMEPAGE_KEYS = [
  'hero_heading',
  'hero_subtext',
  'hero_cta_label',
  'hero_background_image',
  'meta_title',
  'meta_description',
  'og_image_url',
  'phone_number',
] as const;

export type HomepageKey = (typeof HOMEPAGE_KEYS)[number];

export type HomepageContent = Record<HomepageKey, string | null>;

export async function getAllHomepageContent(): Promise<HomepageContent> {
  const { data, error } = await supabaseAdmin
    .from('homepage_content')
    .select('key, value')
    .in('key', [...HOMEPAGE_KEYS]);

  if (error) throw error;

  const result: HomepageContent = {
    hero_heading: null,
    hero_subtext: null,
    hero_cta_label: null,
    hero_background_image: null,
    meta_title: null,
    meta_description: null,
    og_image_url: null,
    phone_number: null,
  };

  for (const row of data ?? []) {
    if (HOMEPAGE_KEYS.includes(row.key as HomepageKey)) {
      result[row.key as HomepageKey] = row.value;
    }
  }

  return result;
}

export async function setHomepageField(key: HomepageKey, value: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from('homepage_content')
    .upsert({ key, value }, { onConflict: 'key' });
  if (error) throw error;
}
