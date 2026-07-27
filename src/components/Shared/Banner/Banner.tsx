/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { Rate } from 'antd';
import { useQuery } from 'react-query';
import { getGoogleRating } from '../../../../services/googleRating';
import { usePathname } from 'next/navigation';
import { usePageBySlug } from '../../../../Hooks/FetchPageBySlug';
import Image from 'next/image';
import { BookingButton } from '../BookingButton/BookingButton';
import { PHONE_DISPLAY } from '../../../../utils/contact';

export const Banner = () => {
  const pathName = usePathname();

  // NOTE: every hook must run before the /blog early return below. Guarding
  // above these calls changed the hook count between blog and non-blog routes
  // and crashed React on client-side navigation.
  const { data, isLoading, isError } = useQuery(['google-rating'], getGoogleRating, {
    retry: false,
  });

  const { data: DynamicData } = usePageBySlug();

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

  const backgroundImageUrl = DynamicData?.page?.HeroBg?.url
    ? encodeURI(buildImageUrl(DynamicData.page.HeroBg.url))
    : '/Assets/Images/BannerImg.jpeg';

  // Only render the rating once a real value has loaded. Never substitute a
  // placeholder score — an invented rating is a misleading advertising claim.
  const rating = typeof data?.rating === 'number' ? data.rating : null;
  const showRating = !isLoading && !isError && rating !== null;

  return (
    <section className="relative w-full min-h-[70vh] flex items-center justify-center overflow-hidden">
      <Image
        src={backgroundImageUrl}
        alt="Arrow Taxi car on the road in Bangor, North Wales"
        fill
        priority
        sizes="(max-width: 1440px) 100vw, 1440px"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black opacity-50" />

      <div className="relative z-10 flex w-full flex-col items-center gap-y-5 px-4 py-16 text-center text-white">
        <h1 className="text-[60px] mobile:text-[32px] font-[700] mobile:!leading-[110%] !leading-[90%] text-shadow-lg">
          {DynamicData?.page?.heroHeading || text.heading}
        </h1>

        <p className="text-[22px] mobile:text-[16px] w-full max-w-[760px] !leading-[145%] !font-medium">
          {DynamicData?.page?.heroSubheading || text.paragraph}
        </p>

        <div className="w-full max-w-[320px] sm:max-w-none pt-1">
          <BookingButton />
        </div>

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
