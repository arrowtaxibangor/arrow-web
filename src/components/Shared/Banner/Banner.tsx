/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { Rate } from 'antd';
import { useQuery } from 'react-query';
import { getGoogleRating } from '../../../../services/googleRating';
import { usePathname } from 'next/navigation';
import { usePageBySlug } from '../../../../Hooks/FetchPageBySlug';
import Link from 'next/link';
import { BookingButton } from '../BookingButton/BookingButton';
import { PHONE_DISPLAY } from '../../../../utils/contact';
import { useSocialIcons } from '../../../../Hooks/useSocialIcons';
import { SOCIAL_ICON_META } from '../../../../utils/socialMediaIcons';
import { useBannerContent } from '../../../../Hooks/useBannerContent';

export const Banner = () => {
  const pathName = usePathname();

  // NOTE: every hook must run before the /blog early return below. Guarding
  // above these calls changed the hook count between blog and non-blog routes
  // and crashed React on client-side navigation.
  const { data, isLoading, isError } = useQuery(['google-rating'], getGoogleRating, {
    retry: false,
  });

  const { data: DynamicData } = usePageBySlug();
  const socialIcons = useSocialIcons();
  const { data: cmsData } = useBannerContent();

  if (pathName?.startsWith('/blog')) return null;

  const buildImageUrl = (urlPath: string) =>
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/${urlPath.replace(/\\/g, '/')}`;

  const getBannerText = () => {
    switch (pathName) {
      case '/':
        return {
          heading: 'Arrow Taxi Bangor',
          paragraph: `Taxis across Bangor, Caernarfon and Gwynedd — 24/7. Book online or call ${PHONE_DISPLAY}.`,
        };
      case '/caernarfon-taxi':
        return {
          heading: 'Caernarfon Taxi Service',
          paragraph: `Your local taxi service in Caernarfon and surrounding areas. Book online or call ${PHONE_DISPLAY}.`,
        };
      case '/snowdon-taxi':
        return {
          heading: 'Snowdonia Taxi Service',
          paragraph:
            'Taxi to all destinations like Aber Falls, Llanberis, Betws-y-Coed, Beddgelert, Porthmadog, Pwllheli, Barmouth and more.',
        };
      case '/luxury':
        return {
          heading: 'North Wales Luxury Chauffeur',
          paragraph: `Have an event? Or just want a luxury travel experience? Call us on ${PHONE_DISPLAY}.`,
        };
      case '/airport-transfers':
        return {
          heading: 'Airport Transfers',
          paragraph: `24/7 transfers to and from all major UK airports. Call us on ${PHONE_DISPLAY}.`,
        };
      case '/top-destinations':
        return {
          heading: 'Explore Top Destinations',
          paragraph: `Book your taxi online or call us on ${PHONE_DISPLAY}.`,
        };
      case '/contact':
        return {
          heading: 'Contact Arrow Taxi Bangor',
          paragraph: `Call us now on ${PHONE_DISPLAY} or book online.`,
        };
      default:
        return {
          heading: 'Arrow Taxi Bangor',
          paragraph: `Call us now on ${PHONE_DISPLAY} or book online.`,
        };
    }
  };

  const text = getBannerText();

  const isHomepage = pathName === '/';

  // On the homepage, CMS data takes priority over external backend data.
  // On other pages, the external backend's DynamicData is used as before.
  const heading = isHomepage
    ? cmsData?.banner_heading || DynamicData?.page?.heroHeading || text.heading
    : DynamicData?.page?.heroHeading || text.heading;

  const paragraph = isHomepage
    ? cmsData?.banner_subtext || DynamicData?.page?.heroSubheading || text.paragraph
    : DynamicData?.page?.heroSubheading || text.paragraph;

  const backgroundImageUrl =
    isHomepage && cmsData?.banner_image
      ? cmsData.banner_image
      : DynamicData?.page?.HeroBg?.url
        ? encodeURI(buildImageUrl(DynamicData.page.HeroBg.url))
        : '/Assets/Images/BannerImg.jpeg';

  // Only render the rating once a real value has loaded. Never substitute a
  // placeholder score — an invented rating is a misleading advertising claim.
  const rating = typeof data?.rating === 'number' ? data.rating : null;
  const showRating = !isLoading && !isError && rating !== null;

  return (
    <section
      className="relative w-full min-h-[70vh] flex items-center justify-center overflow-hidden bg-center bg-cover"
      style={{ backgroundImage: `url('${backgroundImageUrl}')` }}
    >
      <div className="absolute inset-0 bg-black opacity-50" />

      <div className="relative z-10 flex w-full flex-col items-center gap-y-5 px-4 py-16 text-center text-white">
        <h1 className="text-[60px] mobile:text-[32px] font-[700] mobile:!leading-[110%] !leading-[90%] text-shadow-lg">
          {heading}
        </h1>

        <p className="text-[22px] mobile:text-[16px] w-full max-w-[760px] !leading-[145%] !font-medium">
          {paragraph}
        </p>

        <div className="w-full max-w-[320px] sm:max-w-none pt-1">
          <BookingButton />
        </div>

        {socialIcons.length > 0 && (
          <div className="flex items-center gap-x-4 mobile:gap-x-3 pt-2">
            {socialIcons.map((item, index) => {
              const meta = SOCIAL_ICON_META[item.icon];
              if (!meta) return null;
              return (
                <Link
                  key={`${item.icon}-${index}`}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Arrow Taxi on ${meta.label}`}
                  className="flex items-center justify-center w-[44px] h-[44px] mobile:w-[38px] mobile:h-[38px] rounded-full transition-colors hover:bg-white/10"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={meta.src}
                    alt=""
                    className="w-[28px] h-[28px] mobile:w-[24px] mobile:h-[24px] invert brightness-0"
                    style={{ filter: 'brightness(0) invert(1)' }}
                  />
                </Link>
              );
            })}
          </div>
        )}

        {showRating && (
          <div className="flex items-center gap-x-2 text-[18px] mobile:text-[16px] !font-[700] !leading-[100%] text-white">
            <span>Google Rating: {rating}</span>
            <Rate
              allowHalf
              disabled
              value={rating}
              className="text-[18px] mobile:text-[16px] bannerRating"
            />
          </div>
        )}
      </div>
    </section>
  );
};
