import AreasWeCover from '@/components/AreasWeCover/AreasWeCover';
import PaymentMethods from '@/components/Shared/PaymentMethods/PaymentMethods';
import { BookingButton } from '@/components/Shared/BookingButton/BookingButton';
import { fetchPlaceDetails, type PlaceReview } from '@/lib/googlePlaces';
import { getAllHomepageContent } from '@/lib/supabase/homepage';
import { type Metadata } from 'next';
import React from 'react';

const FALLBACK = {
  hero_heading: "Bangor's Trusted Taxi Service",
  hero_subtext: 'Professional, reliable rides across North Wales — available 24/7.',
  hero_cta_label: 'Book a taxi now',
  hero_background_image: '/Assets/Images/homeBgWave.png',
  meta_title: 'Bangor Taxi - Top Rated North Wales Taxi Service',
  meta_description:
    'Call us on 01248209393 to book your taxi. We are based in Bangor, Gwynedd and operate 24/7. Snowdon, Tryfan, Beddgelert, Pwllheli, Caernarfon, Anglesey. To and from all major airports',
  og_image_url: 'https://www.arrow.taxi/Assets/Images/BannerImg.jpeg',
  phone_number: '+441248209393',
};

export async function generateMetadata(): Promise<Metadata> {
  const c = await getAllHomepageContent();
  const metaTitle = c.meta_title || FALLBACK.meta_title;
  const metaDescription = c.meta_description || FALLBACK.meta_description;
  const ogImage = c.og_image_url || FALLBACK.og_image_url;

  return {
    title: metaTitle,
    description: metaDescription,
    alternates: {
      canonical: 'https://www.arrow.taxi/',
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: 'https://www.arrow.taxi/',
      siteName: 'Arrow Taxi',
      locale: 'en_GB',
      type: 'website',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: metaTitle,
        },
      ],
    },
  };
}

export default async function Home() {
  const [placeDetails, c] = await Promise.all([fetchPlaceDetails(), getAllHomepageContent()]);

  const heroHeading = c.hero_heading || FALLBACK.hero_heading;
  const heroSubtext = c.hero_subtext || FALLBACK.hero_subtext;
  const heroCta = c.hero_cta_label || FALLBACK.hero_cta_label;
  const heroBg = c.hero_background_image || FALLBACK.hero_background_image;
  const phone = c.phone_number || FALLBACK.phone_number;
  const ogImage = c.og_image_url || FALLBACK.og_image_url;

  const hasRating =
    placeDetails !== null &&
    typeof placeDetails.rating === 'number' &&
    placeDetails.totalReviews > 0;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Arrow Taxi Bangor',
    url: 'https://www.arrow.taxi/',
    image: ogImage,
    telephone: phone,
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
    // aggregateRating and review are populated from live Google Places data via
    // fetchPlaceDetails(). Both keys are omitted entirely when no data is available.
    ...(hasRating
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: placeDetails!.rating,
            reviewCount: placeDetails!.totalReviews,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
    ...(placeDetails !== null && placeDetails.reviews.length > 0
      ? {
          review: placeDetails.reviews.map((r: PlaceReview) => ({
            '@type': 'Review',
            author: { '@type': 'Person', name: r.authorName },
            reviewRating: {
              '@type': 'Rating',
              ratingValue: r.rating,
              bestRating: 5,
              worstRating: 1,
            },
            reviewBody: r.text,
            datePublished: new Date(r.time * 1000).toISOString(),
          })),
        }
      : {}),
    additionalType: 'TaxiService',
  };

  return (
    <div className="w-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {/* `relative` keeps the wave background anchored to this section — without
          it the absolute child resolves against an ancestor further up the tree. */}
      {/* -mx cancels the layout wrapper's px-16 / mobile:px-6 so the wave stays
          full-bleed, while `relative` keeps the absolute background anchored
          here rather than to an ancestor further up the tree. */}
      <div className="relative -mx-16 mobile:-mx-6 flex items-center justify-center py-20 mobile:py-14 min-h-[60vh] w-auto">
        <div
          className="absolute inset-0 h-full w-full bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('${heroBg}')`,
            backgroundSize: '100% 100%',
          }}
        />
        <div className="relative z-10 flex w-full flex-col items-center gap-6 px-4">
          {/* h2, not h1 — the Banner above already provides this page's single h1. */}
          <h2 className="text-[42px] mobile:text-[28px] font-bold text-white text-center leading-tight drop-shadow-md">
            {heroHeading}
          </h2>
          <p className="text-white text-[18px] mobile:text-[15px] text-center max-w-[500px] drop-shadow">
            {heroSubtext}
          </p>
          <div className="w-full max-w-[320px] sm:max-w-none flex justify-center">
            <BookingButton label={heroCta} />
          </div>
        </div>
      </div>
      <PaymentMethods />
      <AreasWeCover />
    </div>
  );
}
