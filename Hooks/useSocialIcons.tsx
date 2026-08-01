'use client';
import { useQuery } from 'react-query';
import type { SocialIcon } from '@/lib/supabase/cms';
import { DEFAULT_SOCIAL_ICONS } from '../utils/socialMediaIcons';

type SettingsResponse = { socialIcons?: SocialIcon[] };

async function fetchSocialIcons(): Promise<SocialIcon[]> {
  const res = await fetch('/api/cms/settings');
  if (!res.ok) throw new Error('Failed to load site settings');
  const data: SettingsResponse = await res.json();
  return Array.isArray(data.socialIcons) ? data.socialIcons : [];
}

/**
 * Reads the ordered social-icon list from site_settings.social_icons.
 *
 * Falls back to DEFAULT_SOCIAL_ICONS when the request is in flight or errors,
 * so the footer never renders empty on a cold cache or transient failure.
 */
export function useSocialIcons(): SocialIcon[] {
  const { data } = useQuery(['social-icons'], fetchSocialIcons, {
    retry: false,
    refetchInterval: false,
    staleTime: Infinity,
  });
  if (data && data.length > 0) return data;
  return DEFAULT_SOCIAL_ICONS;
}
