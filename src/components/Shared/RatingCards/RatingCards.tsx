/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Rate, Spin } from 'antd';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { getGoogleReviews } from '../../../../services/googleRating';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const ReviewCard = ({ review }: { review: any }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 150;

  const shouldTruncate = review?.message?.length > maxLength;
  const displayText =
    shouldTruncate && !isExpanded
      ? review?.message?.substring(0, maxLength) + '...'
      : review?.message;

  return (
    // Height is fixed rather than content-driven so every slide lines up;
    // expanding a long review scrolls inside the card instead of stretching
    // the carousel track and shifting its neighbours.
    <div className="w-full h-[390px] bg-[#F7F7F8] flex flex-col border border-solid border-[#E5E5EA] p-[24px] mobilelg:p-[20px] rounded-[10px]">
      <div className="flex flex-row gap-3 border-b border-solid border-[#E5E5EA] pb-6 flex-shrink-0">
        <div>
          {review?.profilePhoto ? (
            <img
              src={review?.profilePhoto}
              alt={`${review?.name} on Google Reviews`}
              width={56}
              height={56}
              loading="lazy"
              decoding="async"
              className="h-[56px] w-[56px] mobilelg:h-[48px] mobilelg:w-[48px] rounded-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/Assets/Icons/dummyProfileImage.png';
              }}
            />
          ) : (
            <div className="w-[56px] h-[56px] mobilelg:!h-[48px] mobilelg:!w-[48px] rounded-full flex justify-center items-center bg-primary_color text-white text-[25px] font-semibold">
              {review?.name?.charAt(0)}
            </div>
          )}
        </div>
        <div className="h-full flex justify-center items-start flex-col gap-1 min-h-[56px]">
          <h4 className="text-[20px] mobilelg:text-[16px] leading-[100%] font-semibold text-[#0F1125]">
            {review?.name}
          </h4>
          <span className="text-[16px] mobilelg:text-[13px] leading-[100%] font-medium text-[#5C5D63]">
            {review?.date}
          </span>
        </div>
      </div>

      <div className="mt-4 flex-shrink-0">
        <Rate allowHalf value={review?.rating} disabled />
      </div>

      <div className={`mt-4 min-h-0 flex-1 ${isExpanded ? 'overflow-y-auto' : 'overflow-hidden'}`}>
        <p className="text-[18px] mobilelg:text-[16px] leading-[190%] mobilelg:leading-[180%] font-normal text-[#0F1125]">
          {displayText}
        </p>
      </div>

      {shouldTruncate && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 flex min-h-[44px] flex-shrink-0 items-center self-start text-primary_color text-[14px] font-medium hover:underline"
        >
          {isExpanded ? 'Show less' : 'Read more'}
        </button>
      )}
    </div>
  );
};

const RatingCards = () => {
  const { data, isLoading, isError } = useQuery(['google-reviews'], getGoogleReviews, {
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[180px]">
        <Spin size="large" />
      </div>
    );
  }

  // Never render a broken or empty carousel — drop the section entirely.
  if (isError || !data?.reviews?.length) return null;

  return (
    <section
      aria-label="Google reviews"
      className="w-full px-6 mobilelg:px-4 mt-[84px] mobilelg:mt-[40px]"
    >
      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        // Mobile-first: one readable card at 375px, widening to the full
        // three-up layout only once there is room for it.
        slidesPerView={1}
        spaceBetween={16}
        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 20 },
          1024: { slidesPerView: 3, spaceBetween: 24 },
        }}
        className="!pb-14 [&_.swiper-button-next]:hidden [&_.swiper-button-prev]:hidden sm:[&_.swiper-button-next]:flex sm:[&_.swiper-button-prev]:flex [&_.swiper-button-next]:text-primary_color [&_.swiper-button-prev]:text-primary_color [&_.swiper-pagination-bullet-active]:!bg-primary_color"
      >
        {data.reviews.map((review: any, index: number) => (
          <SwiperSlide key={index} className="!h-auto">
            <ReviewCard review={review} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default RatingCards;
