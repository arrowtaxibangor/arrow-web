'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PHONE_DISPLAY, PHONE_HREF } from '../../../../utils/contact';
import { BookingButton } from '../BookingButton/BookingButton';

type PageConfig = {
  heading: string;
  subtext: string;
  destinations: string[];
};

const PAGE_CONFIG: Record<string, PageConfig> = {
  '/caernarfon-taxi': {
    heading: 'Need a Ride to Caernarfon?',
    subtext: 'Direct pickups from Bangor, no waiting.',
    destinations: ['Caernarfon Castle', 'Caernarfon Town', 'Bontnewydd', 'Llanwnda'],
  },
  '/snowdon-taxi': {
    heading: 'Need a Ride to Snowdonia?',
    subtext: 'Direct pickups from Bangor Station, no waiting.',
    destinations: ['Llanberis', 'Pen y Pass', 'Beddgelert', 'Betws-y-Coed'],
  },
  '/luxury': {
    heading: 'Book a Luxury Chauffeur',
    subtext: 'Premium vehicles for events, airports, and special occasions.',
    destinations: ['Airport Transfers', 'Wedding Cars', 'Corporate Travel', 'Private Tours'],
  },
  '/airport-transfers': {
    heading: 'Airport Transfer?',
    subtext: '24/7 pickups to and from all major UK airports.',
    destinations: ['Manchester Airport', 'Liverpool Airport', 'Birmingham Airport', 'Heathrow'],
  },
  '/top-destinations': {
    heading: 'Explore North Wales',
    subtext: 'We cover all the top spots across the region.',
    destinations: ['Snowdonia', 'Anglesey', 'Conwy', 'Llandudno'],
  },
  '/contact': {
    heading: 'Ready to Book?',
    subtext: 'Get in touch or book your ride online right now.',
    destinations: ['Bangor', 'Caernarfon', 'Snowdonia', 'Airports'],
  },
};

const DEFAULT_CONFIG: PageConfig = {
  heading: 'Need a Taxi?',
  subtext: 'Fast, reliable pickups across North Wales.',
  destinations: ['Bangor', 'Caernarfon', 'Snowdonia', 'Airports'],
};

export function BookingSidebarCard() {
  const pathname = usePathname();
  const config = PAGE_CONFIG[pathname ?? ''] ?? DEFAULT_CONFIG;

  return (
    <div className="sticky top-[100px] rounded-2xl bg-primary_color shadow-md overflow-hidden">
      {/* Yellow top accent bar */}
      <div className="h-2 bg-[#FEC601]" />

      <div className="p-6 flex flex-col gap-4">
        {/* Heading & subtext */}
        <div className="text-center">
          <h3 className="text-[18px] font-bold text-white leading-tight mb-1">{config.heading}</h3>
          <p className="text-[13px] text-white/80 leading-snug">{config.subtext}</p>
        </div>

        {/* Destination list */}
        <ul className="flex flex-col gap-2">
          {config.destinations.map((dest) => (
            <li key={dest} className="flex items-center gap-2 text-[14px] text-white">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white/15 flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-[#FEC601]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              {dest}
            </li>
          ))}
        </ul>

        {/* CTA button */}
        <BookingButton
          label="Book Taxi Now"
          size="sidebar"
          location="sidebar_card"
          trailingIcon={
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          }
        />

        {/* Phone + rating */}
        <div className="flex items-center justify-between pt-3 border-t border-white/20">
          <Link
            href={PHONE_HREF}
            className="flex items-center gap-1.5 text-[13px] font-semibold text-white"
          >
            <svg className="w-3.5 h-3.5 text-[#FEC601]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.47 11.47 0 003.58.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.47 11.47 0 00.57 3.58 1 1 0 01-.25 1.02l-2.2 2.19z" />
            </svg>
            {PHONE_DISPLAY}
          </Link>
          <span className="flex items-center gap-1 text-[12px] font-semibold text-white/80">
            <svg className="w-3.5 h-3.5 text-[#FEC601]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
            4.9 rated
          </span>
        </div>
      </div>
    </div>
  );
}
