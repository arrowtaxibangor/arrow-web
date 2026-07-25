'use client';
import { Col, Grid, Row } from 'antd';
import Link from 'next/link';
import React from 'react';

const { useBreakpoint } = Grid;

const AirportTransferForm = () => {
  const screens = useBreakpoint();
  return (
    <Row className="w-full h-full py-20 mobile:py-14" gutter={[screens.md ? 24 : 0, 24]}>
      <Col xxl={14} xl={14} lg={14} md={24} sm={24} xs={24}>
        <div>
          <h1 className="text-primary_color text-[32px] mobilelg:text-[24px] tablet:text-[28px] leading-[61px] mobilelg:leading-[40px] tablet:leading-[50px] font-semibold">
            24/7 Airport Transfers from North Wales
          </h1>
          <h3 className="text-[20px] mobilelg:text-[16px] tablet:text-[18px] leading-[42px] mobilelg:leading-[32px] tablet:leading-[38px] text-[#000000] font-normal pt-5 mobilelg:pt-3 tablet:pt-4 pb-4 mobilelg:pb-2 tablet:pb-3">
            Flying soon? Whether it’s Liverpool,{' '}
            <b className="!font-semibold">Manchester, Birmingham, or any London Airport</b>, Arrow
            Taxi makes sure you get there comfortably, on time, and at the best price in the area.
          </h3>
        </div>
        <div className="text-[16px] tablet:text-[14px] leading-[42px] mobilelg:leading-[32px] tablet:leading-[38px] !font-light">
          <h3 className="text-[22px] leading-[42px] tabletlg:!leading-[35px] font-normal pb-4">
            Why Choose Arrow Taxi for Airport Transfers?
          </h3>
          <ul className="list-disc pl-6">
            <li>
              <b className="!font-semibold">24/7 Service</b> – day or night, we’ve got you covered
            </li>
            <li>
              <b className="!font-semibold">On-Time Pickups Guaranteed</b> – never miss a flight
            </li>
            <li>
              <b className="!font-semibold">Clean, Comfortable Cars</b> – travel in style and
              comfort
            </li>
            <li>
              <b className="!font-semibold">Professional Local Drivers</b> – friendly and reliable
            </li>
            <li>
              <b className="!font-semibold">Lowest Fares in the Area</b> – quality service at
              unbeatable prices
            </li>
          </ul>
        </div>
        <h3 className="text-[22px] leading-[42px] tabletlg:!leading-[35px] font-normal">
          Simple, Stress-Free Travel
        </h3>
        <p className="text-[16px] tablet:text-[14px] leading-[42px] mobilelg:leading-[32px] tablet:leading-[38px] !font-light">
          Whether you’re flying out or arriving back, we provide smooth, direct transfers from your
          door to the terminal and back again.
          <br />
          <b className="!font-semibold">Call us today on 01248 20 93 93</b> or{' '}
          <b className="!font-semibold">book online</b> in minutes!
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

export default AirportTransferForm;
