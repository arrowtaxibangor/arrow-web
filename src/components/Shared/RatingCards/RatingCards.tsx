/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { message, Rate, Spin } from 'antd';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { getGoogleReviews } from '../../../../services/googleRating';

const ReviewCard = ({ review }: { review: any }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 150; // Adjust as needed

  const shouldTruncate = review?.message?.length > maxLength;
  const displayText =
    shouldTruncate && !isExpanded
      ? review?.message?.substring(0, maxLength) + '...'
      : review?.message;

  return (
    <div
      className={`w-full max-w-[404px] bg-[#F7F7F8] flex flex-col border border-solid border-[#E5E5EA] p-[24px] mobilelg:p-[20px] rounded-[10px] transition-all duration-300 ${
        isExpanded ? 'h-auto' : 'h-[390px]'
      }`}
    >
      <div className="flex flex-row gap-3 border-b border-solid border-[#E5E5EA] pb-6 flex-shrink-0">
        <div>
          {review?.profilePhoto ? (
            <img
              src={review?.profilePhoto}
              alt={review?.name}
              className="h-[56px] w-[56px] mobilelg:h-[48px] mobilelg:w-[48px] rounded-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/Assets/Icons/dummyProfileImage.png';
              }}
            />
          ) : (
            <div className="w-[56px] h-[56px] mobilelg:!h-[48px] mobilelg:!w-[48px] rounded-full flex justify-center items-center bg-[#265EA6] text-white text-[25px] font-semibold">
              {review?.name?.charAt(0)}
            </div>
          )}
        </div>
        <div className="h-full flex justify-center items-start flex-col gap-1 min-h-[56px]">
          <h4 className="text-[20px] mobilelg:text-[16px] leading-[100%] font-semibold text-[#0F1125]">
            {review?.name}
          </h4>
          <span className="text-[16px] mobilelg:text-[13px] leading-[100%] font-medium text-[#717276]">
            {review?.date}
          </span>
        </div>
      </div>

      <div className="mt-4 flex-shrink-0">
        <Rate allowHalf value={review?.rating} disabled />
      </div>

      <div className={`mt-4 flex flex-col ${!isExpanded ? 'flex-1 overflow-hidden' : ''}`}>
        <div className={!isExpanded ? 'flex-1' : ''}>
          <p className="text-[18px] mobilelg:text-[16px] leading-[190%] mobilelg:leading-[180%] font-normal text-[#0F1125]">
            {displayText}
          </p>
        </div>
        {shouldTruncate && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 text-[#265EA6] text-[14px] font-medium hover:underline self-start flex-shrink-0"
          >
            {isExpanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>
    </div>
  );
};

const RatingCards = () => {
  const { data, isLoading } = useQuery(['google-reviews'], getGoogleReviews, {
    onError: (err: any) => {
      message.error(err.message || 'Failed to load reviews');
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[180px]">
        <Spin size="large" />
      </div>
    );
  }

  if (!data?.reviews?.length) {
    return <div className="text-center text-gray-500">No reviews found.</div>;
  }

  // const reviews = [...data?.reviews]?.reverse().slice(0, 3);

  return (
    <div className="flex flex-row gap-6 flex-wrap justify-center items-start mt-[84px]">
      {data?.reviews?.map((review: any, index: number) => (
        <ReviewCard key={index} review={review} />
      ))}
    </div>
  );
};

export default RatingCards;
