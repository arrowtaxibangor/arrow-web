'use client';
import { Col, Grid, Row } from 'antd';
import React from 'react';

const { useBreakpoint } = Grid;

const AreasWeCover = () => {
  const screens = useBreakpoint();

  return (
    <div className="w-full mt-14">
      <div className="flex justify-center text-[16px] mobilelg:text-[14px] leading-[42px] mobilelg:leading-[34px] font-light">
        <p>
          Arrow Taxi Bangor is the new rising star of Gwynedd taxi services. Whether you are looking
          to book a long distance ride or a local night out, you can book with confidence. We offer
          nice clean cars and friendly professional drivers.
          <br />
          If you are a tourist looking to book a taxi for a day/week you are welcome to discuss your
          plans with the driver and they can then give you our best quote.
        </p>
      </div>
      <div className="text-[16px] leading-[42px] mobilelg:leading-[32px] font-light pt-5 px-6 mobilelg:px-2 pb-0 w-full max-w-[1200px] mx-auto">
        <h2 className="text-[32px] mobilelg:text-[24px] font-semibold text-primary_color w-full text-start pb-5 mobilelg:pb-2">
          Popular Areas We Cover:
        </h2>
        <Row gutter={[12, 0]} className="w-full">
          <Col xxl={8} lg={8} md={8} sm={24} xs={24} className="w-full flex justify-start">
            <ul className="list-disc pl-6 !font-normal !text-[20px] !leading-[36px] !text-[#625B71]">
              <li>Gwynedd</li>
              <li>Bangor Train Station</li>
              <li>Caernarfon</li>
            </ul>
          </Col>
          <Col
            xxl={8}
            lg={8}
            md={8}
            sm={24}
            xs={24}
            className={`w-full flex ${screens.md ? 'justify-center' : 'justify-start'}`}
          >
            <ul className="list-disc pl-6 !font-normal !text-[20px] !leading-[36px] !text-[#625B71]">
              <li>Snowdonia National Park</li>
              <li>Beddgelert</li>
              <li>South Stack, Anglesey</li>
            </ul>
          </Col>
          <Col
            xxl={8}
            lg={8}
            md={8}
            sm={24}
            xs={24}
            className={`w-full flex ${screens.md ? 'justify-end' : 'justify-start'}`}
          >
            <ul className="list-disc pl-6 !font-normal !text-[20px] !leading-[36px] !text-[#625B71]">
              <li>Penmon Lighthouse, Anglesey</li>
              <li>Porthmadog</li>
              <li>Pwllheli</li>
            </ul>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AreasWeCover;
