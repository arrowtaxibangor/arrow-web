import React from 'react';
import Image from 'next/image';
import {
  ADDRESS_LINE,
  EMAIL,
  EMAIL_HREF,
  OPENING_HOURS,
  PHONE_DISPLAY,
  PHONE_HREF,
} from '../../../../utils/contact';

export default function ContactInfo() {
  return (
    <div className="tabletlg:rounded-[30px] rounded-r-[30px] rounded-l-[0] overflow-hidden shadow-md h-full gap-[10px] flex flex-col bg-primary_color p-[21px]">
      {/* Map */}
      {/* <div className="relative h-full"> */}
      <iframe
        src="https://storage.googleapis.com/maps-solutions-0zgn2pu963/locator-plus/4clt/locator-plus.html"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        className="rounded-[10px] !max-w-[538px] tabletlg:!max-w-full !h-[590px]"
      />

      {/* <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow text-xs">
          <h3 className="font-semibold text-[#E74C3C] text-sm">Company name</h3>
          <p className="text-gray-600">315 W 36th St.</p>
          <p className="text-gray-600">NY 10018</p>
        </div> */}
      {/* </div> */}

      {/* Info */}
      <div className="text-white flex flex-col justify-center gap-[20px]">
        <p className="text-[16px] leading-[29px] font-[400]">
          Book a taxi online or give us a call on {PHONE_DISPLAY}. We offer cheap airport runs,
          Snowdonia taxi services, tours, and photo tours.
        </p>

        <div className="space-y-[15px] text-sm pb-[20px]">
          <div className="flex items-center gap-4">
            <Image
              width={20}
              height={24}
              alt=""
              aria-hidden="true"
              src={'/Assets/Icons/location.svg'}
            />
            <span className="text-[16px] leading-[140%] font-normal">{ADDRESS_LINE}</span>
          </div>
          <a
            href={PHONE_HREF}
            aria-label={`Call Arrow Taxi on ${PHONE_DISPLAY}`}
            className="flex items-center gap-4 min-h-[44px] hover:underline"
          >
            <Image
              width={22}
              height={22}
              alt=""
              aria-hidden="true"
              src={'/Assets/Icons/phoneIcon.svg'}
            />
            <span className="text-[16px] leading-[100%] font-normal">{PHONE_DISPLAY}</span>
          </a>
          <a href={EMAIL_HREF} className="flex items-center gap-4 min-h-[44px] hover:underline">
            <Image
              width={22}
              height={17}
              alt=""
              aria-hidden="true"
              src={'/Assets/Icons/email.svg'}
            />
            <span className="text-[16px] leading-[100%] font-normal">{EMAIL}</span>
          </a>
          <p className="text-[16px] leading-[140%] font-normal pt-[10px]">{OPENING_HOURS}</p>
        </div>
      </div>
    </div>
  );
}
