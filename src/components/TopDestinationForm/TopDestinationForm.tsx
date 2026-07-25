'use client';
import { Col, Grid, Row } from 'antd';
import Link from 'next/link';
import React from 'react';

const { useBreakpoint } = Grid;

const TopDestinationForm = () => {
  const screens = useBreakpoint();
  return (
    <Row className="w-full h-full py-20 mobile:py-14" gutter={[screens.md ? 24 : 0, 24]}>
      <Col xxl={14} xl={14} lg={14} md={24} sm={24} xs={24}>
        <div>
          <h1 className="text-[#333C33] text-[32px] mobilelg:text-[24px] tablet:text-[28px] leading-[61px] mobilelg:leading-[40px] tablet:leading-[50px] font-semibold">
            <span className="text-[#3362AB]">Highlight top travel destinations:</span> Snowdon,
            Anglesey, Conwy, Llandudno.
          </h1>
          <h3 className="text-[20px] mobilelg:text-[16px] tablet:text-[18px] leading-[42px] mobilelg:leading-[32px] tablet:leading-[38px] text-[#000000] font-normal pt-10 mobilelg:pt-6 tablet:pt-8 pb-8 mobilelg:pb-5 tablet:pb-6">
            Private tours, sightseeing taxi services available.
          </h3>
          <div className="text-[16px] tablet:text-[14px] leading-[42px] mobilelg:leading-[32px] tablet:leading-[38px] !font-light">
            <ul className="list-disc pl-6">
              <li>Customized long-distance taxi options.</li>
            </ul>
          </div>
        </div>
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

export default TopDestinationForm;
