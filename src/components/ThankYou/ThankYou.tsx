/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import ThankYouHeader from './ThankYouHeader';
import { message, Spin } from 'antd';
import { useQuery } from 'react-query';
import { getBookingById } from '../../../services/booking';
import { useSearchParams } from 'next/navigation';
import { getSuccess } from '../../../services/stripe';
import moment from 'moment-timezone';

export default function ThankYou() {
  const params = useSearchParams();
  const bookingId = params.get('bookingId');
  const returnBookingId = params.get('returnBookingId');
  const sessionId = params.get('session_id');

  useQuery(['booking-payment', sessionId], () => getSuccess(sessionId), {
    onSuccess: (res) => {
      message.success(res?.message);
    },
    enabled: !!sessionId,
  });

  const { data, isLoading } = useQuery(
    ['get-booking', bookingId],
    () => getBookingById(Number(bookingId)),
    {
      onError: (err: any) => {
        message.error(err?.response.data.message);
      },
      enabled: !!Number(bookingId),
    }
  );

  const { data: returnBookingData } = useQuery(
    ['get-return-booking', returnBookingId],
    () => getBookingById(Number(returnBookingId)),
    {
      onError: (err: any) => {
        message.error(err?.response.data.message);
      },
      enabled: !!Number(returnBookingId),
    }
  );

  const name = data?.booking?.name;
  const amountPaid = data?.booking?.chargedAmount;
  const returnAmountPaid = returnBookingData?.booking?.chargedAmount;
  const convertedPickup = data?.booking?.convertedPickup;
  const convertedDropOff = data?.booking?.convertedDropOff;
  const fare = parseFloat(data?.booking?.estimatedCost as string);
  const time = data?.booking?.time && moment(data.booking.time).tz('Europe/London').format('HH:mm');
  const date =
    data?.booking?.date && moment(data.booking.date).tz('Europe/London').format('DD/MM/YYYY');
  const returnfare = parseFloat(returnBookingData?.booking?.estimatedCost as string);
  const returnTime =
    returnBookingData?.booking?.time &&
    moment(returnBookingData?.booking?.time).tz('Europe/London').format('HH:mm');
  const returnDate =
    returnBookingData?.booking?.date &&
    moment(returnBookingData?.booking?.date).tz('Europe/London').format('DD/MM/YYYY');

  return (
    <div className="w-full flex justify-center items-center py-7 flex-col text-primary_color">
      <h1 className="text-[24px] sm:text-[27px] text-center font-[700] pt-10 uppercase">
        Thank you for booking
        <br />
        <span className="text-primary_color">your ride</span> with us!
      </h1>

      {!isLoading ? (
        <>
          {/* Show trips */}
          {returnBookingData ? (
            <>
              <ThankYouHeader
                bookingTitle="Booking Details"
                name={name}
                fare={fare}
                pickUpDate={date}
                pickUpTime={time}
                vehicleTypes={data?.booking?.VehicleTypes}
                pickLocation={convertedPickup}
                dropLocation={convertedDropOff}
                isPaymentOnline={data?.booking?.isPaymentOnline}
                trip="Trip 1"
              />
              <ThankYouHeader
                bookingTitle="Return Booking Details"
                name={returnBookingData?.booking?.name}
                fare={returnfare}
                pickUpDate={returnDate}
                pickUpTime={returnTime}
                vehicleTypes={returnBookingData?.booking?.VehicleTypes}
                pickLocation={returnBookingData?.booking?.convertedPickup}
                dropLocation={returnBookingData?.booking?.convertedDropOff}
                isPaymentOnline={data?.booking?.isPaymentOnline}
                trip="Trip 2"
              />
            </>
          ) : (
            <ThankYouHeader
              bookingTitle="Booking Details"
              name={name}
              fare={fare}
              pickUpDate={date}
              pickUpTime={time}
              vehicleTypes={data?.booking?.VehicleTypes}
              pickLocation={convertedPickup}
              dropLocation={convertedDropOff}
              isPaymentOnline={data?.booking?.isPaymentOnline}
            />
          )}

          {/* Show Total Paid only once */}
          <div className="text-[22px] sm:text-[27px] text-primary_color font-[500] mt-4">
            {amountPaid || returnAmountPaid ? 'Total Amount Paid' : 'Total Amount'}:{' '}
            <span className="text-primary_color font-normal">
              £{returnBookingData ? (fare + returnfare).toFixed(2) : fare.toFixed(2)}
            </span>
          </div>
        </>
      ) : (
        <Spin className="w-full h-[300px] flex justify-center items-center" />
      )}
    </div>
  );
}
