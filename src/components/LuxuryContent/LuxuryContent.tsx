/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';

function LuxuryContent() {
  const carImages = [
    '/Assets/Images/01.jpg',
    '/Assets/Images/02.jpg',
    '/Assets/Images/03.jpg',
    '/Assets/Images/05.jpg',
    '/Assets/Images/06.jpg',
    '/Assets/Images/07.webp',
  ];

  return (
    <div className="w-full">
      <h1 className="text-primary_color text-[32px] mobilelg:text-[24px] tablet:text-[28px] leading-[61px] mobilelg:leading-[40px] tablet:leading-[50px] font-semibold">
        North Wales Luxury Chauffeur Service
      </h1>
      {/* Fancy Image Slider */}
      <div className="mt-10 w-full max-w-5xl mx-auto">
        <Swiper
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={'auto'}
          loop={true}
          initialSlide={1}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 2.5,
            slideShadows: false,
          }}
          modules={[EffectCoverflow]}
          className="mySwiper"
        >
          {carImages?.map((src, index) => (
            <SwiperSlide key={index} className="!w-[380px] !h-[392px]">
              <img
                src={src}
                alt={`Car ${index + 1}`}
                className="rounded-xl shadow-lg object-cover w-full h-full"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      {/* <p className="w-full text-[20px] leading-[42px] tabletlg:!leading-[35px] font-normal pt-8">
        Transfers to/from major airports: Liverpool, Manchester, Birmingham, London.
        <br />
      </p> */}
      <p className="w-full text-[16px] leading-[42px] tabletlg:!leading-[35px] font-light pt-4">
        Experience the elegance of true luxury travel with our{' '}
        <b className="!font-semibold">black Mercedes S-Class chauffeur service.</b> Whether you’re a
        business executive, a discerning traveler, or celebrating a special occasion, we deliver
        comfort, prestige, and reliability that sets us apart across{' '}
        <b className="!font-semibold">Bangor and all of North Wales.</b>
      </p>

      <h1 className="text-[22px] leading-[42px] tabletlg:!leading-[35px] font-normal">
        Why Travel With Us?
      </h1>
      <ul className="text-[16px] tablet:text-[14px] leading-[42px] mobilelg:leading-[32px] tablet:leading-[38px] !font-light list-disc pl-5">
        <li>
          <b className="!font-semibold">Luxury Vehicle</b> – Glide through every journey in our
          immaculate <b className="!font-semibold">Mercedes S-Class</b>, designed for ultimate
          comfort and style.
        </li>
        <li>
          <b className="!font-semibold">Corporate Excellence</b> – Discreet, professional, and
          reliable service for executives and VIPs.
        </li>
        <li>
          <b className="!font-semibold">Special Occasions</b> – Weddings, anniversaries, gala
          evenings, or private celebrations—make every moment unforgettable.
        </li>
        <li>
          <b className="!font-semibold">24/7 Airport Transfers</b> – Stress-free connections to and
          from all major UK airports.
        </li>
        <li>
          <b className="!font-semibold">Guaranteed Punctuality</b> – We pride ourselves on{' '}
          <b className="!font-semibold">on-time pickups</b> every single time.
        </li>
        <li>
          <b className="!font-semibold">Best Value in North Wales</b> – Premium service, delivered
          at the most competitive rates in the region.
        </li>
      </ul>

      <h1 className="text-[22px] leading-[42px] tabletlg:!leading-[35px] font-normal pt-3">
        Perfect For:
      </h1>
      <ul className="text-[16px] tablet:text-[14px] leading-[42px] mobilelg:leading-[32px] tablet:leading-[38px] !font-light list-disc pl-5">
        <li>Corporate & executive travel</li>
        <li>Luxury airport transfers</li>
        <li>Weddings & special events</li>
        <li>Private tours of North Wales</li>
      </ul>
    </div>
  );
}

export default LuxuryContent;
