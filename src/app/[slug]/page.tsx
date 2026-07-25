import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPageBySlug, getSiteSetting, listPublishedPages } from '@/lib/supabase/cms';
import CmsPageRenderer from '@/components/CmsPageRenderer/CmsPageRenderer';
import PaymentMethods from '@/components/Shared/PaymentMethods/PaymentMethods';

export const revalidate = false;
export const dynamicParams = true;

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  const pages = await listPublishedPages();
  return pages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = await getPageBySlug(params.slug);
  if (!page) return { title: 'Page Not Found - Arrow Taxi' };

  return {
    metadataBase: new URL('https://arrow.taxi'),
    title: page.meta_title ?? `${page.title} - Arrow Taxi`,
    description: page.meta_description ?? '',
    keywords: page.meta_keywords ?? '',
    alternates: { canonical: page.canonical_url ?? `/${page.slug}` },
    openGraph: {
      title: page.meta_title ?? page.title,
      description: page.meta_description ?? '',
      images: page.og_image_url ? [page.og_image_url] : [],
    },
  };
}

export default async function Page({ params }: Props) {
  const [page, bookingUrl] = await Promise.all([
    getPageBySlug(params.slug),
    getSiteSetting('booking_url'),
  ]);
  if (!page?.is_published) notFound();

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <CmsPageRenderer page={page} bookingUrl={bookingUrl ?? '#'} />
      <PaymentMethods />
    </div>
  );
}
