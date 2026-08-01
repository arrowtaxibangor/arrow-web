import { useQuery } from 'react-query';

type BannerContent = {
  banner_heading: string | null;
  banner_subtext: string | null;
  banner_image: string | null;
};

async function fetchBannerContent(): Promise<BannerContent> {
  const res = await fetch('/api/cms/banner');
  if (!res.ok) throw new Error('Failed to fetch banner content');
  return res.json() as Promise<BannerContent>;
}

export function useBannerContent() {
  return useQuery<BannerContent>(['cms-banner'], fetchBannerContent, {
    staleTime: 60_000,
    retry: false,
  });
}
