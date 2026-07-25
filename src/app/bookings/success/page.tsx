import ThankYou from '@/components/ThankYou/ThankYou';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Thank you for booking your ride with Arrow Taxi Bangor',
};

const page = () => {
  return <ThankYou />;
};

export default page;
