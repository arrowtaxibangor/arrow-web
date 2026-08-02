import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getDraft } from '@/lib/preview-drafts';
import type { HomepageDraftContent } from '@/lib/preview-drafts';
import { getSiteSetting } from '@/lib/supabase/cms';
import { PreviewBanner } from '@/components/admin/ui/PreviewBanner';
import { BookingButton } from '@/components/Shared/BookingButton/BookingButton';
import AreasWeCover from '@/components/AreasWeCover/AreasWeCover';
import PaymentMethods from '@/components/Shared/PaymentMethods/PaymentMethods';

export const dynamic = 'force-dynamic';

type Props = { searchParams: { token?: string } };

const FALLBACK = {
  hero_heading: "Bangor's Trusted Taxi Service",
  hero_subtext: 'Professional, reliable rides across North Wales — available 24/7.',
  hero_cta_label: 'Book Online',
  hero_background_image: '/Assets/Images/homeBgWave.png',
  areas_html: '',
};

export default async function PreviewHomepage({ searchParams }: Props) {
  const token = searchParams.token;
  if (!token) notFound();

  const draft = await getDraft(token);
  if (!draft || draft.type !== 'homepage') {
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

  const fields = (draft.content as HomepageDraftContent).fields;
  const bookingUrl = await getSiteSetting('booking_url');

  const heroHeading = fields.hero_heading || FALLBACK.hero_heading;
  const heroSubtext = fields.hero_subtext || FALLBACK.hero_subtext;
  const heroCta = fields.hero_cta_label || FALLBACK.hero_cta_label;
  const heroBg = fields.hero_background_image || FALLBACK.hero_background_image;
  const areasHtml = fields.areas_html || FALLBACK.areas_html;

  return (
    <>
      <PreviewBanner editorHref="/admin/homepage" label="Preview: Homepage" />
      <div className="w-full">
        <div className="relative -mx-16 mobile:-mx-6 flex items-center justify-center py-20 mobile:py-14 min-h-[60vh] w-auto">
          <Image
            src={heroBg}
            alt=""
            fill
            priority
            sizes="(max-width: 1440px) 100vw, 1440px"
            style={{ objectFit: 'fill' }}
            className="pointer-events-none select-none"
          />
          <div className="relative z-10 flex w-full flex-col items-center gap-6 px-4">
            <h2 className="text-[42px] mobile:text-[28px] font-bold text-white text-center leading-tight drop-shadow-md">
              {heroHeading}
            </h2>
            <p className="text-white text-[18px] mobile:text-[15px] text-center max-w-[500px] drop-shadow">
              {heroSubtext}
            </p>
            <div className="w-full max-w-[320px] sm:max-w-none flex justify-center">
              <BookingButton label={heroCta} href={bookingUrl ?? '#'} />
            </div>
          </div>
        </div>
        <PaymentMethods />
        <AreasWeCover html={areasHtml} />
      </div>
    </>
  );
}
