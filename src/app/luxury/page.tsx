import LuxuryForm from '@/components/LuxuryContent/LuxuryForm';
import PaymentMethods from '@/components/Shared/PaymentMethods/PaymentMethods';
import Head from 'next/head';
import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'North Wales Luxury Chauffeur - Arrow Taxi',
  description:
    'Experience the elegance of true luxury travel with our black Mercedes S-Class chauffeur service across Bangor and all of North Wales.',
  alternates: {
    canonical: 'https://www.arrow.taxi/luxury',
  },
  openGraph: {
    title: 'North Wales Luxury Chauffeur - Arrow Taxi',
    description:
      'Experience the elegance of true luxury travel with our black Mercedes S-Class chauffeur service across Bangor and all of North Wales.',
    url: 'https://www.arrow.taxi/luxury',
    siteName: 'Arrow Taxi',
    locale: 'en_GB',
    type: 'website',
    images: [
      {
        url: 'https://www.arrow.taxi/Assets/Images/BannerImg.jpeg',
        width: 1200,
        height: 630,
        alt: 'North Wales Luxury Chauffeur - Arrow Taxi',
      },
    ],
  },
};

function Page() {
  return (
    <div className="flex w-full flex-col justify-center items-center">
      <Head>
        <title>{`North Wales Luxury Chauffeur - Arrow Taxi`}</title>
      </Head>
      <LuxuryForm />
      <PaymentMethods />
    </div>
  );
}

export default Page;
