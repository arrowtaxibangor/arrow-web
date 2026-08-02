import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  getPageBySlug,
  getSiteSetting,
  listPublishedPages,
  getButtonVariants,
} from '@/lib/supabase/cms';
import CmsPageRenderer from '@/components/CmsPageRenderer/CmsPageRenderer';
import PaymentMethods from '@/components/Shared/PaymentMethods/PaymentMethods';

export const revalidate = false;
export const dynamicParams = true;

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  const pages = await listPublishedPages();
  return pages.map((p) => ({ slug: p.slug }));
}

const HOMEPAGE_BANNER = 'https://www.arrow.taxi/Assets/Images/BannerImg.jpeg';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = await getPageBySlug(params.slug);
  if (!page) return { title: 'Page Not Found - Arrow Taxi' };

  const canonicalUrl = page.canonical_url ?? `https://www.arrow.taxi/${page.slug}`;
  const ogTitle = page.meta_title ?? `${page.title} - Arrow Taxi`;
  const ogDescription = page.meta_description ?? '';
  const ogImageUrl = page.og_image_url ?? HOMEPAGE_BANNER;

  return {
    title: ogTitle,
    description: ogDescription,
    keywords: page.meta_keywords ?? '',
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonicalUrl,
      siteName: 'Arrow Taxi',
      locale: 'en_GB',
      type: 'website',
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: ogTitle }],
    },
  };
}

export default async function Page({ params }: Props) {
  const [page, bookingUrl, buttonVariants] = await Promise.all([
    getPageBySlug(params.slug),
    getSiteSetting('booking_url'),
    getButtonVariants(),
  ]);
  if (!page?.is_published) notFound();

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <CmsPageRenderer page={page} bookingUrl={bookingUrl ?? '#'} buttonVariants={buttonVariants} />
      <PaymentMethods />
    </div>
  );
}
