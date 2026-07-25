/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

const ThankYouHeader = React.memo(
  ({
    name,
    fare,
    pickUpDate,
    pickUpTime,
    vehicleTypes,
    pickLocation,
    dropLocation,
    bookingTitle,
    isPaymentOnline,
    trip,
  }: {
    name: string;
    fare: number;
    pickUpDate: any;
    pickUpTime: any;
    vehicleTypes: any;
    pickLocation: any;
    dropLocation: any;
    bookingTitle: string;
    isPaymentOnline: boolean;
    trip?: string;
  }) => {
    return (
      <>
        <div className="mt-6 mb-2 text-[22px] sm:text-[27px] text-primary_color font-[600]">
          {bookingTitle}
        </div>
        <div className="flex text-[27px] tabletlg:text-[18px] justify-center items-center text-center flex-col mb-6 px-[10px]">
          {name && (
            <div className=" text-primary_color font-[500]">
              Name: <span className="text-primary_color font-normal">{name}</span>
            </div>
          )}
          {pickUpDate && pickUpTime && (
            <div className=" text-primary_color font-[500]">
              Pickup date/time:{' '}
              <span className="text-primary_color font-normal">{`${pickUpDate} | ${pickUpTime}`}</span>
            </div>
          )}
          {location && (
            <div className=" text-primary_color font-[500]">
              Pickup address: <span className="text-primary_color font-normal">{pickLocation}</span>
            </div>
          )}
          {location && (
            <div className=" text-primary_color font-[500]">
              Dropoff: <span className="text-primary_color font-normal">{dropLocation}</span>
            </div>
          )}
          {vehicleTypes && (
            <div>
              <div className="text-[22px] sm:text-[27px] text-primary_color font-[600]">
                Vehicle Types
              </div>
              {vehicleTypes?.map((vehicleType: any) => (
                <div
                  key={vehicleType?.id}
                  className=" text-primary_color font-[500] flex mobile:flex-col justify-center items-center gap-2"
                >
                  <div>
                    Vehicle Type:{' '}
                    <span className="text-primary_color font-normal">
                      {vehicleType?.vehicleType?.vehicleType}
                    </span>
                  </div>
                  <span className="mobile:hidden block">|</span>
                  <div>
                    Number of vehicles:{' '}
                    <span className="text-primary_color font-normal">
                      {vehicleType?.numberOfVehicles}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="mb-10">
          {fare && (
            <div className="text-[22px] sm:text-[27px] text-primary_color font-[500]">
              {isPaymentOnline
                ? `Fare${trip ? ` (${trip})` : ''}:`
                : `Fare${trip ? ` (${trip})` : ''}:`}
              <span className="text-primary_color font-normal"> £{fare?.toFixed(2)}</span>
            </div>
          )}
        </div>
      </>
    );
  }
);

export default ThankYouHeader;
