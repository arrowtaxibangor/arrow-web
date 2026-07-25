'use client';
import { Col, Grid, Row } from 'antd';
import Link from 'next/link';
import React from 'react';

const { useBreakpoint } = Grid;

const SnowdonTaxiForm = () => {
  const screens = useBreakpoint();
  return (
    <Row className="w-full h-full py-20 mobile:py-14" gutter={[screens.md ? 24 : 0, 24]}>
      <Col xxl={14} xl={14} lg={14} md={24} sm={24} xs={24}>
        <div>
          <h1 className="text-primary_color text-[32px] mobilelg:text-[24px] tablet:text-[28px] leading-[46px] mobilelg:leading-[40px] tablet:leading-[39px] font-semibold">
            Taxi Service from Bangor Train Station to Llanberis, Pen y Pass, Beddgelert, and
            Betws-y-Coed in Snowdonia
          </h1>
          {/* <h3 className="text-[20px] mobilelg:text-[16px] tablet:text-[18px] leading-[35px] mobilelg:leading-[30px] tablet:leading-[32px] text-[#000000] font-normal pt-5">
            Taxi to all destinations like Aber Falls, Llanberis, Betws-y-Coed, Beddgelert,
            Porthmadog, Pwllheli, Barmouth and more
          </h3> */}
          <h1 className="text-[22px] leading-[42px] tabletlg:!leading-[35px] font-normal pt-3">
            Fast, Friendly & Dependable Transfers
          </h1>
          <div className="text-[16px] tablet:text-[14px] leading-[32px] mobilelg:leading-[30px] tablet:leading-[38px] !font-light flex flex-col gap-1 pb-3">
            <p>
              Arriving at <b className="!font-semibold">Bangor Train Station</b> and heading towards
              the stunning mountains of <b className="!font-semibold">Snowdonia</b>?
              <br />
              Arrow Taxi is here to make your journey smooth and stress-free.
            </p>
            <p>We provide private hire and taxi services to all key destinations, including:</p>
          </div>
          <ul className="text-[16px] tablet:text-[14px] leading-[42px] mobilelg:leading-[32px] tablet:leading-[38px] !font-light list-disc pl-5">
            <li>Aber Falls -</li>
            <li>
              <b className="!font-semibold">Llanberis</b> – gateway to Snowdon mountain
            </li>
            <li>
              <b className="!font-semibold">Pen y Pass</b> – the starting point for famous hiking
              routes
            </li>
            <li>
              <b className="!font-semibold">Beddgelert</b> – a charming Welsh village full of
              history
            </li>
            <li>
              <b className="!font-semibold">Betws-y-Coed</b> – the picturesque “Gateway to
              Snowdonia”
            </li>
            <li>Porthmadog -</li>
            <li>Pwllheli -</li>
            <li>Barmouth - an amazing seaside town</li>
          </ul>
          <h1 className="text-[22px] leading-[42px] tabletlg:!leading-[35px] font-normal pt-3">
            Why Choose Arrow Taxi?
          </h1>
          <ul className="text-[16px] tablet:text-[14px] leading-[42px] mobilelg:leading-[32px] tablet:leading-[38px] !font-light list-disc pl-5">
            <li>
              <b className="!font-semibold">Direct pickups from Bangor railway station</b> – no
              waiting, no hassle
            </li>
            <li>
              <b className="!font-semibold">Perfect for hikers & adventurers</b> – including the
              Welsh 3000s & 15 Peaks challenge
            </li>
            <li>
              <b className="!font-semibold">Based in Llanberis</b> – right in the heart of Snowdonia
              National Park
            </li>
            <li>
              <b className="!font-semibold">Trusted local drivers</b> with years of experience
            </li>
            <li>
              <b className="!font-semibold">Easy booking</b> – call or reserve online in minutes
            </li>
          </ul>
          <h1 className="text-[22px] leading-[42px] tabletlg:!leading-[35px] font-normal pt-3">
            Start Your Snowdonia Adventure the Right Way
          </h1>
          <div className="text-[16px] tablet:text-[14px] leading-[32px] mobilelg:leading-[30px] tablet:leading-[38px] !font-light flex flex-col gap-5">
            <p>
              Whether you’re here for a mountain trek, a weekend getaway, or simply exploring the
              breathtaking scenery, Arrow Taxi ensures you travel in comfort and on time.
            </p>
            <p>
              <b className="!font-semibold">Call 01248 20 93 93</b> or{' '}
              <b className="!font-semibold">book online today</b> to secure your ride.
            </p>
            <p>
              Arrow Taxi – <b className="!font-semibold">Your Journey to Snowdon Starts Here.</b>
            </p>
          </div>
          {/* <div className="text-[16px] tablet:text-[14px] leading-[32px] mobilelg:leading-[30px] tablet:leading-[38px] !font-light flex flex-col gap-5">
            <p>
              Looking for dependable taxi services around Snowdonia and Snowdon mountain?
              <br /> Arrow Taxi offers private hire and taxi services covering key destinations like
              Llanberis, Pen y Pass, Beddgeiert, and Betws-y-Coed — perfect for locals and visitors
              alike.
            </p>
            <p>
              Taxi from Bangor Railway Station to Snowdonia
              <br />
              Arriving at Bangor railway station in Gwynedd? Arrow Taxi provides convenient
              transfers to popular Snowdonia spots, ensuring a smooth start to your adventure.
            </p>
            <p>
              Explore Llanberis and Snowdonia National Park with Arrow Taxi
              <br />
              Based in Llanberis, within the heart of Snowdonia National Park, Arrow Taxi is an
              experienced and trusted service provider. Whether you’re exploring Llanberis, Bangor,
              or tackling the famous 15 Peaks and Welsh 3000s challenge, we’ve got your transport
              covered
            </p>
            <p>
              Book Your Snowdonia Taxi Today
              <br />
              Secure your ride in advance for hassle-free travel. Call us on 01248 20 93 93 or book
              online using the form on the right.
              <br />
              Planning a visit to Snowdon mountain or the beautiful Snowdonia region? Let Arrow Taxi
              handle your transport — from Bangor station pickups to scenic rides around the park,
              we’re here to help you make the most of your trip
            </p>
          </div> */}
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

export default SnowdonTaxiForm;
