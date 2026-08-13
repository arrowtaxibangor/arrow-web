import { Image } from 'antd';
import React from 'react';
import RatingCards from '../RatingCards/RatingCards';
import { BookingButton } from '../BookingButton/BookingButton';

const PaymentMethodIcons = [
  { id: 1, src: '/Assets/Icons/visa.svg', label: 'Visa' },
  { id: 2, src: '/Assets/Icons/mastercard.svg', label: 'Mastercard' },
  { id: 3, src: '/Assets/Icons/yandex.svg', label: 'Yandex Pay' },
  { id: 4, src: '/Assets/Icons/google-pay.svg', label: 'Google Pay' },
  { id: 5, src: '/Assets/Icons/apple-pay.svg', label: 'Apple Pay' },
];

const PaymentMethods = () => {
  return (
    <>
      <div className="w-full flex flex-col justify-center items-center gap-10 mobilelg:gap-6 px-12 tablet:px-8 py-8 mobilelg:py-6">
        <div>
          <h2 className="text-[35px] mobile:text-[24px] leading-[90%] mobilelg:leading-[80%] font-bold text-primary_color">
            Payment Methods
          </h2>
        </div>
        {/* Single-row layout: nowrap + shrinking gaps + shrinking icons so
            all five methods stay on one line down to the smallest phone. */}
        <div className="flex flex-row flex-nowrap items-center justify-center gap-[40px] tabletlg:gap-[24px] mobilelg:gap-[12px] mobile:gap-[8px] w-full">
          {PaymentMethodIcons?.map((method) => (
            <Image
              key={method?.id}
              alt={`We accept ${method.label}`}
              preview={false}
              src={method?.src}
              className="!w-[80px] !h-[55px] tabletlg:!w-[65px] tabletlg:!h-[45px] mobilelg:!w-[52px] mobilelg:!h-[36px] mobile:!w-[42px] mobile:!h-[30px] flex-shrink"
            />
          ))}
        </div>
      </div>
      <RatingCards />

      {/* Second conversion point: the reviews above build trust, so repeat the
          CTA immediately after them rather than leaving the next action offscreen. */}
      <div className="w-full flex flex-col items-center gap-4 px-6 py-12 mobilelg:py-8">
        <p className="text-center text-[18px] mobile:text-[16px] font-medium text-[#0F1125]">
          Ready to go? Book online in under a minute.
        </p>
        <div className="w-full max-w-[320px] sm:max-w-none flex justify-center">
          <BookingButton location="payment_methods_below" />
        </div>
      </div>
    </>
  );
};

export default PaymentMethods;
