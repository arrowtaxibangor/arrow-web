import { notFound } from 'next/navigation';
import type { CmsPage } from '@/lib/supabase/cms';
import { getSiteSetting, getButtonVariants } from '@/lib/supabase/cms';
import { getDraft } from '@/lib/preview-drafts';
import type { PageDraftContent } from '@/lib/preview-drafts';
import CmsPageRenderer from '@/components/CmsPageRenderer/CmsPageRenderer';
import PaymentMethods from '@/components/Shared/PaymentMethods/PaymentMethods';
import { PreviewBanner } from '@/components/admin/ui/PreviewBanner';

export const dynamic = 'force-dynamic';

type Props = { params: { slug: string }; searchParams: { token?: string } };

export default async function PreviewCmsPage({ params, searchParams }: Props) {
  const token = searchParams.token;
  if (!token) notFound();

  const draft = await getDraft(token);
  if (!draft || draft.type !== 'page') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-center px-4">
        <p className="text-xl font-semibold text-gray-800">Preview expired</p>
        <p className="text-gray-500 text-sm">
          This preview link has expired or is invalid. Go back to the CMS editor and click Preview
          again.
        </p>
      </div>
    );
  }

  const content = draft.content as PageDraftContent;

  const [bookingUrl, buttonVariants] = await Promise.all([
    getSiteSetting('booking_url'),
    getButtonVariants(),
  ]);

  const page: CmsPage = {
    id: '__preview__',
    slug: params.slug,
    title: content.meta.title,
    meta_title: content.meta.meta_title,
    meta_description: content.meta.meta_description,
    meta_keywords: content.meta.meta_keywords,
    canonical_url: content.meta.canonical_url,
    og_image_url: content.meta.og_image_url,
    google_tag: content.meta.google_tag,
    is_published: true,
    is_in_header: content.meta.is_in_header,
    has_booking_button: content.meta.has_booking_button,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    sections: content.sections.map((s, i) => ({
      ...s,
      id: `preview-${i}`,
      page_id: '__preview__',
      created_at: new Date().toISOString(),
    })),
  };

  const editorHref = params.slug === '__new__' ? '/admin/pages/new' : `/admin/pages/${params.slug}`;

  return (
    <>
      <PreviewBanner editorHref={editorHref} label={`Preview: ${page.title}`} />
      <div className="w-full flex flex-col justify-center items-center">
        <CmsPageRenderer
          page={page}
          bookingUrl={bookingUrl ?? '#'}
          buttonVariants={buttonVariants}
        />
        <PaymentMethods />
      </div>
    </>
  );
}
