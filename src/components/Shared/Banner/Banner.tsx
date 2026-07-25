/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { message, Rate } from 'antd';
import { socialMediaIcons } from '../../../../utils/socialMediaIcons';
import Link from 'next/link';
import { useQuery } from 'react-query';
import { getGoogleRating } from '../../../../services/googleRating';
import { usePathname } from 'next/navigation';
import { usePageBySlug } from '../../../../Hooks/FetchPageBySlug';
import Image from 'next/image';

export const Banner = () => {
  const pathName = usePathname();

  const { data, isLoading } = useQuery(['google-rating'], getGoogleRating, {
    onError: (err: any) => {
      message.error(err?.response?.data?.message);
    },
  });

  const { data: DynamicData } = usePageBySlug();

  const buildImageUrl = (urlPath: string) =>
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/${urlPath.replace(/\\/g, '/')}`;

  const getBannerText = () => {
    switch (pathName) {
      case '/':
        return {
          heading: 'Arrow Taxi Bangor',
          paragraph:
            'Book your ride online or call us on 01248 20 93 93. Based in Bangor we provide taxi services in Gwynedd covering all popular areas like Bethesda, Caernarfon, Y Felinheli and surrounding areas.',
        };
      case '/caernarfon-taxi':
        return {
          heading: 'Caernarfon Taxi Service',
          paragraph:
            'Your local taxi service in Caernarfon and surrounding areas, book online or call us on 01248 209393',
        };
      case '/snowdon-taxi':
        return {
          heading: 'Snowdonia Taxi Service',
          paragraph:
            'Taxi to all destinations like Aber Falls, Llanberis, Betws-y-Coed, Beddgelert, Porthmadog, Pwllheli, Barmouth and more',
        };
      case '/luxury':
        return {
          heading: 'North Wales Luxury Chauffeur',
          paragraph:
            'Have an event? Or just want a luxury travel experience? Call us on 01248209393',
        };
      case '/airport-transfers':
        return {
          heading: 'Airport Transfers',
          paragraph: '24/7 transfers to and from all major UK airports, call us on 01248 209393',
        };
      case '/top-destinations':
        return {
          heading: 'Explore Top Destinations',
          paragraph: 'Book your taxi online or call us on 01248 20 93 93.',
        };
      case '/contact':
        return {
          heading: 'Arrow Taxi Bangor',
          paragraph: 'Call us now on 01248 20 93 93 or book online!',
        };
      default:
        return {
          heading: 'Arrow Taxi Bangor',
          paragraph: 'Call us now on 01248 20 93 93 or book online!',
        };
    }
  };

  const text = getBannerText();

  const backgroundImageUrl = DynamicData?.page?.HeroBg?.url
    ? encodeURI(buildImageUrl(DynamicData.page.HeroBg.url))
    : '/Assets/Images/BannerImg.jpeg';

  console.log('image', backgroundImageUrl);

  return (
    <div className="relative w-full h-[70vh]">
      <Image src={backgroundImageUrl} alt="hero" fill priority className="object-cover" />
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center px-4 gap-y-[18px]">
        <h1 className="text-[60px] mobile:text-[35px] font-[700] mobile:!leading-[100%] !leading-[90%] text-shadow-lg">
          {DynamicData?.page?.heroHeading || text.heading}
        </h1>

        <p className="text-[22px] mobile:text-[15px] w-full max-w-[1100px] !leading-[140%] !font-medium">
          {DynamicData?.page?.heroSubheading || text.paragraph}
        </p>

        <div className="flex flex-wrap mobile:gap-x-[20px] gap-x-[35px] gap-y-4 justify-center items-center">
          {socialMediaIcons?.map((item) => {
            const isValidLink = item?.href && item?.href !== '#';

            const IconContent = (
              <div className="mobile:w-[30px] mobile:h-[30px] w-[50px] h-[50px] cursor-pointer relative">
                <Image
                  src={item?.icon}
                  alt="icon"
                  fill
                  sizes="(max-width: 768px) 30px, 50px"
                  className="object-contain"
                />
              </div>
            );

            return isValidLink ? (
              <Link href={item.href} target="_blank" key={item.icon}>
                {IconContent}
              </Link>
            ) : (
              <div key={item.icon}>{IconContent}</div>
            );
          })}
        </div>

        <div className="flex items-center">
          <div className="text-[20px] mobile:text-[18px] !font-[700] !leading-[100%] text-white space-x-2">
            Google Rating: {isLoading ? '5' : data?.rating}
            <Rate
              allowHalf
              disabled
              value={data?.rating || 5}
              className="text-[20px] mobile:text-[18px] bannerRating"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
