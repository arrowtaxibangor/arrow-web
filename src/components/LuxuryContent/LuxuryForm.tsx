'use client';
import { Col, Grid, Row } from 'antd';
import Link from 'next/link';
import React from 'react';
import LuxuryContent from './LuxuryContent';

const { useBreakpoint } = Grid;

const LuxuryForm = () => {
  const screens = useBreakpoint();
  return (
    <Row gutter={[screens.md ? 24 : 0, 24]} className="w-full h-full py-20 mobile:py-14">
      <Col xs={24} sm={24} md={24} lg={14} xl={14} xxl={14}>
        <LuxuryContent />
      </Col>
      <Col
        xs={24}
        sm={24}
        md={24}
        lg={10}
        xl={10}
        xxl={10}
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

export default LuxuryForm;
