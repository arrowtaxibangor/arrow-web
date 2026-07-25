import { Image } from 'antd';
import React from 'react';
import RatingCards from '../RatingCards/RatingCards';

const PaymentMethods = () => {
  const PaymentMethodIcons = [
    { id: 1, src: '/Assets/Icons/visa.svg' },
    { id: 2, src: '/Assets/Icons/mastercard.svg' },
    { id: 3, src: '/Assets/Icons/yandex.svg' },
    { id: 4, src: '/Assets/Icons/google-pay.svg' },
    { id: 5, src: '/Assets/Icons/apple-pay.svg' },
  ];

  return (
    <>
      <div className="w-full flex flex-col justify-center items-center gap-10 mobilelg:gap-6 px-12 tablet:px-8 py-8 mobilelg:py-6">
        <div>
          <h2 className="text-[35px] mobile:text-[24px] leading-[90%] mobilelg:leading-[80%] font-bold text-[#45A69D]">
            Payment Methods
          </h2>
        </div>
        <div className="flex flex-row flex-wrap gap-[50px] justify-center">
          {PaymentMethodIcons?.map((method) => (
            <Image
              key={method?.id}
              alt=""
              preview={false}
              src={method?.src}
              className="w-[90px] h-[60px] mobilelg:!h-[35px] mobilelg:!w-[65px] tabletlg:!h-[45px] tabletlg:w-[75px]"
            />
          ))}
        </div>
      </div>
      <RatingCards />
    </>
  );
};

export default PaymentMethods;
