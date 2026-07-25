import LuxuryForm from '@/components/LuxuryContent/LuxuryForm';
import PaymentMethods from '@/components/Shared/PaymentMethods/PaymentMethods';
import Head from 'next/head';
import React from 'react';

export const metadata = {
  title: 'North Wales Luxury Chauffeur - Arrow Taxi',
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
