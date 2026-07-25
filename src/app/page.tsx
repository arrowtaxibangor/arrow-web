import AreasWeCover from '@/components/AreasWeCover/AreasWeCover';
import PaymentMethods from '@/components/Shared/PaymentMethods/PaymentMethods';
import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';

export const metadata: Metadata = {
  title: 'Bangor Taxi - Top Rated North Wales Taxi Service',
  description:
    'Call us on 01248209393 to book your taxi. We are based in Bangor, Gwynedd and operate 24/7. Snowdon, Tryfan, Beddgelert, Pwllheli, Caernarfon, Anglesey. To and from all major airports',
};

export default async function Home() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness', // ✅ Changed from TaxiService
    name: 'Arrow Taxi Bangor',
    url: 'https://www.arrow.taxi/',
    image: 'https://www.arrow.taxi/Assets/Images/BannerImg.jpeg',
    telephone: '+441248209393',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Bangor',
      addressRegion: 'Gwynedd',
      postalCode: 'LL57',
      addressCountry: 'GB',
    },
    sameAs: [
      'https://www.facebook.com/ArrowBangorTaxi',
      'https://www.instagram.com/ArrowTaxiBangor',
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: 5,
      reviewCount: 1,
      bestRating: 5,
    },
    additionalType: 'TaxiService', // Optional: still specify your business type
  };
  return (
    <div className="w-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="flex items-center justify-center py-20 mobile:py-14 h-[60vh] w-full">
        <div
          className="absolute top-0 left-0 w-full bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/Assets/Images/homeBgWave.png')",
            height: '60vh',
            backgroundSize: '100% 100%',
          }}
        />
        <div className="relative z-10 flex flex-col items-center gap-6">
          <h1 className="text-[42px] mobile:text-[28px] font-bold text-white text-center leading-tight drop-shadow-md">
            Bangor&apos;s Trusted Taxi Service
          </h1>
          <p className="text-white text-[18px] mobile:text-[15px] text-center max-w-[500px] drop-shadow">
            Professional, reliable rides across North Wales — available 24/7.
          </p>
          <Link
            href="https://PLACEHOLDER_ICABBY_BOOKING_URL"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 px-10 py-4 bg-[#FEC601] hover:bg-yellow-400 text-black font-bold text-[20px] mobile:text-[16px] rounded-full shadow-lg transition-colors"
          >
            Book Me
          </Link>
        </div>
      </div>
      <PaymentMethods />
      <AreasWeCover />
    </div>
  );
}
