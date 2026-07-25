'use client';
import { Col, Grid, Row } from 'antd';
import Link from 'next/link';
import React from 'react';

const { useBreakpoint } = Grid;

const CaernarfonForm = () => {
  const screens = useBreakpoint();
  return (
    <Row className="w-full h-full py-20 mobile:py-14" gutter={[screens.md ? 24 : 0, 24]}>
      <Col xxl={14} xl={14} lg={14} md={24} sm={24} xs={24}>
        <div>
          <h1 className="text-primary_color text-[32px] mobilelg:text-[24px] tablet:text-[28px] leading-[46px] mobilelg:leading-[40px] tablet:leading-[39px] font-semibold">
            Caernarfon Taxi Service
          </h1>
          <p className="text-[16px] tablet:text-[14px] leading-[42px] mobilelg:leading-[32px] tablet:leading-[38px] !font-light pt-8">
            Exploring <b className="!font-semibold">Caernarfon</b> or planning a day out in
            Snowdonia? Arrow Taxi is your trusted local taxi company, providing fast, friendly, and
            reliable transport across Gwynedd and beyond
          </p>
          <h3 className="text-[20px] mobilelg:text-[16px] tablet:text-[18px] leading-[35px] mobilelg:leading-[30px] tablet:leading-[32px] text-[#000000] font-normal pt-10 mobilelg:pt-6 tablet:pt-8 pb-2">
            Discover Caernarfon with Arrow Taxi
          </h3>
          <div className="text-[16px] tablet:text-[14px] leading-[42px] mobilelg:leading-[32px] tablet:leading-[38px] !font-light pb-4">
            <p>We’ll take you to all the must-see attractions, including:</p>
            <ul className="list-disc pl-6">
              <li>
                <b className="!font-semibold">Caernarfon Castle</b> – the world-famous UNESCO World
                Heritage Site
              </li>
              <li>
                <b className="!font-semibold">Caernarfon Harbour & Waterfront</b> – perfect for a
                relaxing stroll
              </li>
              <li>
                <b className="!font-semibold">Menai Strait & Seiont River</b> – scenic rides and
                boat trips
              </li>
              <li>
                <b className="!font-semibold">Welsh Highland Railway</b> – journey through
                breathtaking Snowdonia
              </li>
              <li>
                <b className="!font-semibold">Snowdonia National Park</b> – mountain hikes and
                scenic tours just minutes away
              </li>
              <li>
                <b className="!font-semibold">Galeri Caernarfon Theatre & Arts Centre</b> – culture,
                music, and live shows
              </li>
              <li>
                <b className="!font-semibold">Caernarfon Town Centre</b> – shopping, cafés, and
                traditional pubs
              </li>
            </ul>
          </div>
          <h3 className="text-[20px] mobilelg:text-[16px] tablet:text-[18px] leading-[35px] mobilelg:leading-[30px] tablet:leading-[32px] text-[#000000] font-normal pt-10 mobilelg:pt-6 tablet:pt-8 pb-2">
            Why Ride with Arrow Taxi?
          </h3>
          <div className="text-[16px] tablet:text-[14px] leading-[42px] mobilelg:leading-[32px] tablet:leading-[38px] !font-light pb-4">
            <ul className="list-disc pl-6">
              <li>
                <b className="!font-semibold">Local, trusted drivers</b> who know Caernarfon inside
                out
              </li>
              <li>
                <b className="!font-semibold">On-time pickups guaranteed</b>
              </li>
              <li>
                <b className="!font-semibold">Perfect for tourists</b> – station, hotel & attraction
                transfers
              </li>
              <li>
                <b className="!font-semibold">Affordable fares</b> with no hidden costs
              </li>
              <li>
                <b className="!font-semibold">Book in seconds</b> – by phone or online
              </li>
            </ul>
          </div>
        </div>

        <h3 className="text-[22px] leading-[42px] tabletlg:!leading-[35px] font-normal">
          Your Caernarfon Adventure Starts Here
        </h3>
        <p className="text-[16px] tablet:text-[14px] leading-[42px] mobilelg:leading-[32px] tablet:leading-[38px] !font-light">
          From castle tours to Snowdonia day trips, Arrow Taxi makes sure you get where you need to
          be, safely and comfortably.
          <br />
          <b className="!font-semibold">Call 01248 20 93 93</b> or{' '}
          <b className="!font-semibold">book online today!</b>
        </p>
      </Col>
      <Col
        xxl={10}
        xl={10}
        lg={10}
        md={24}
        sm={24}
        xs={24}
        className="flex justify-center items-center"
      >
        <Link
          href="https://PLACEHOLDER_ICABBY_BOOKING_URL"
          target="_blank"
          rel="noopener noreferrer"
          className="px-10 py-4 bg-[#FEC601] hover:bg-yellow-400 text-black font-bold text-[20px] rounded-full shadow-lg transition-colors"
        >
          Book Me
        </Link>
      </Col>
    </Row>
  );
};

export default CaernarfonForm;
