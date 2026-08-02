'use client';
import { useQuery } from 'react-query';

export type CtaStyle = {
  bgColor: string;
  textColor: string;
  fontSize: number;
};

export const DEFAULT_CTA_STYLE: CtaStyle = {
  bgColor: '#FEC601',
  textColor: '#ffffff',
  fontSize: 18,
};

type SettingsResponse = { ctaBgColor?: string; ctaTextColor?: string; ctaFontSize?: number };

async function fetchCtaStyle(): Promise<CtaStyle> {
  const res = await fetch('/api/cms/settings');
  if (!res.ok) throw new Error('Failed to load site settings');
  const data: SettingsResponse = await res.json();
  return {
    bgColor: data.ctaBgColor ?? DEFAULT_CTA_STYLE.bgColor,
    textColor: data.ctaTextColor ?? DEFAULT_CTA_STYLE.textColor,
    fontSize: data.ctaFontSize ?? DEFAULT_CTA_STYLE.fontSize,
  };
}

export function useCtaStyle() {
  return useQuery(['cta-style'], fetchCtaStyle, {
    retry: false,
    refetchInterval: false,
    staleTime: Infinity,
  });
}
