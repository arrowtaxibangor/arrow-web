import ThankYou from '@/components/ThankYou/ThankYou';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Thank you for booking your ride with Arrow Taxi Bangor',
};

export const dynamic = 'force-dynamic';

const ThankYouPage = () => {
  return <ThankYou />;
};

export default ThankYouPage;
