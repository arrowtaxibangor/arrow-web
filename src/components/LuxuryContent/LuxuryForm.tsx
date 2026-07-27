'use client';
import { Col, Grid, Row } from 'antd';
import React from 'react';
import LuxuryContent from './LuxuryContent';
import { BookingButton } from '../Shared/BookingButton/BookingButton';

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
        <BookingButton />
      </Col>
    </Row>
  );
};

export default LuxuryForm;
