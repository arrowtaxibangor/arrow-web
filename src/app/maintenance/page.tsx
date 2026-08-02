import { type Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Booking Temporarily Unavailable | Arrow Taxi Bangor',
  description:
    'Our online booking is briefly under maintenance. Call us on 01248 20 93 93 to book your taxi instantly.',
};

export default function MaintenancePage() {
  return (
    <div className="w-full flex flex-col items-center justify-center py-20 mobile:py-12 text-center gap-8">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-20 h-20 mobile:w-14 mobile:h-14 text-primary_color"
        aria-hidden="true"
      >
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>

      <div className="flex flex-col gap-4 max-w-[600px] mobile:max-w-full mobile:px-2">
        <h2 className="text-[36px] mobile:text-[26px] font-bold text-gray-800 leading-tight">
          We&apos;re Under Maintenance
        </h2>
        <p className="text-[18px] mobile:text-[15px] text-gray-600 leading-relaxed">
          Our goal is always to provide you with the best service. While we carry out some
          improvements, you can still book a ride instantly by giving us a call.
        </p>
      </div>

      <a
        href="tel:+441248209393"
        className="inline-flex items-center gap-3 bg-primary_color text-white font-bold text-[22px] mobile:text-[18px] px-10 py-4 rounded-xl shadow-lg hover:opacity-90 transition-opacity"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6 flex-shrink-0"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z"
            clipRule="evenodd"
          />
        </svg>
        01248 20 93 93
      </a>

      <p className="text-[14px] text-gray-400">
        Available 24 / 7 &mdash; we&apos;ll be back online very soon.
      </p>
    </div>
  );
}
