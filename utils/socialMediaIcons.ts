import type { SocialIcon, SupportedSocialIcon } from '@/lib/supabase/cms';

// Maps a supported icon slug to its SVG under /public/Assets/Icons/ and a
// human-readable label used for accessible link names. Extending the list
// requires adding a matching SVG and updating SUPPORTED_SOCIAL_ICONS in
// src/lib/supabase/cms.ts.
export const SOCIAL_ICON_META: Record<SupportedSocialIcon, { src: string; label: string }> = {
  facebook: { src: '/Assets/Icons/facebook.svg', label: 'Facebook' },
  whatsapp: { src: '/Assets/Icons/whatsapp.svg', label: 'WhatsApp' },
  instagram: { src: '/Assets/Icons/instagram.svg', label: 'Instagram' },
  youtube: { src: '/Assets/Icons/youtube.svg', label: 'YouTube' },
  pinterest: { src: '/Assets/Icons/pinterest.svg', label: 'Pinterest' },
  twitter: { src: '/Assets/Icons/twitter.svg', label: 'X (formerly Twitter)' },
};

// Ships as the last-resort default when site_settings.social_icons has not
// been seeded yet. The migration (005_social_icons.sql) seeds this same list.
export const DEFAULT_SOCIAL_ICONS: SocialIcon[] = [
  { icon: 'facebook', url: 'https://www.facebook.com/ArrowBangorTaxi' },
  { icon: 'whatsapp', url: 'https://wa.me/441248209393' },
  { icon: 'instagram', url: 'https://www.instagram.com/ArrowTaxiBangor' },
  { icon: 'youtube', url: 'https://www.youtube.com/channel/UCC5gakSUeQOmv3W41GJ73CQ' },
  { icon: 'pinterest', url: 'https://uk.pinterest.com/ArrowBangorTaxi' },
  { icon: 'twitter', url: 'https://x.com/ArrowTaxiBangor' },
];
