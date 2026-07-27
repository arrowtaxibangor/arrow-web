import AreasWeCover from '@/components/AreasWeCover/AreasWeCover';
import PaymentMethods from '@/components/Shared/PaymentMethods/PaymentMethods';
import { BookingButton } from '@/components/Shared/BookingButton/BookingButton';
import { Metadata } from 'next';
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
    // No aggregateRating here on purpose. It previously hardcoded a 5.0 from a
    // single review while the real Google rating is 4.9 from many — publishing
    // invented review markup breaches Google's structured data policy and risks
    // a manual action. To restore it, feed real values through
    // utils/getGoogleRatingServer.ts rather than literals.
    additionalType: 'TaxiService', // Optional: still specify your business type
  };
  return (
    <div className="w-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {/* `relative` keeps the wave background anchored to this section — without
          it the absolute child resolved against an ancestor further up the tree. */}
      {/* -mx cancels the layout wrapper's px-16 / mobile:px-6 so the wave stays
          full-bleed, while `relative` keeps the absolute background anchored
          here rather than to an ancestor further up the tree. */}
      <div className="relative -mx-16 mobile:-mx-6 flex items-center justify-center py-20 mobile:py-14 min-h-[60vh] w-auto">
        <div
          className="absolute inset-0 h-full w-full bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/Assets/Images/homeBgWave.png')",
            backgroundSize: '100% 100%',
          }}
        />
        <div className="relative z-10 flex w-full flex-col items-center gap-6 px-4">
          {/* h2, not h1 — the Banner above already provides this page's single h1. */}
          <h2 className="text-[42px] mobile:text-[28px] font-bold text-white text-center leading-tight drop-shadow-md">
            Bangor&apos;s Trusted Taxi Service
          </h2>
          <p className="text-white text-[18px] mobile:text-[15px] text-center max-w-[500px] drop-shadow">
            Professional, reliable rides across North Wales — available 24/7.
          </p>
          <div className="w-full max-w-[320px] sm:max-w-none flex justify-center">
            <BookingButton />
          </div>
        </div>
      </div>
      <PaymentMethods />
      <AreasWeCover />
    </div>
  );
}
