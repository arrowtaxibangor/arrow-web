// Client-safe constants and types for social icons. Kept out of
// src/lib/supabase/cms.ts so client components can import the icon slug list
// without dragging in the Supabase service-role client.

export const SUPPORTED_SOCIAL_ICONS = [
  'facebook',
  'whatsapp',
  'instagram',
  'youtube',
  'pinterest',
  'twitter',
] as const;

export type SupportedSocialIcon = (typeof SUPPORTED_SOCIAL_ICONS)[number];

export type SocialIcon = {
  icon: SupportedSocialIcon;
  url: string;
};

export function isSupportedIcon(value: unknown): value is SupportedSocialIcon {
  return typeof value === 'string' && (SUPPORTED_SOCIAL_ICONS as readonly string[]).includes(value);
}
