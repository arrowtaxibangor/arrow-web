import React from 'react';
import Image from 'next/image';

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
          Book a taxi online or give us a call on 01248209393. We offer cheap airport runs, Snowdon
          taxi services, tours, and photo tours.
        </p>

        <div className="space-y-[15px] text-sm pb-[20px]">
          <div className="flex items-center gap-4">
            <Image width={20} height={24} alt="location" src={'/Assets/Icons/location.svg'} />
            <span className="text-[16px] leading-[100%] font-normal">
              Arrow Taxi Bangor Station Road, Bangor LL57 1LZ
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Image width={22} height={22} alt="phone" src={'/Assets/Icons/phoneIcon.svg'} />
            <span className="text-[16px] leading-[100%] font-normal">01248209393</span>
          </div>
          {/* <div className="flex items-center gap-4">
            <Image width={22} height={17} alt="email" src={'/Assets/Icons/email.svg'} />
            <span className="text-[16px] leading-[100%] font-normal">bookings@arrow.taxi</span>
          </div> */}
        </div>
      </div>
    </div>
  );
}
