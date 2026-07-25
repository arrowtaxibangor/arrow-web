/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useState } from 'react';
import { BookingState, useBookingStore } from '../store/useStore';
import isBetween from 'dayjs/plugin/isBetween';
import dayjs from 'dayjs';
import { useFareData } from '../Hooks/useFareData';

dayjs.extend(isBetween);

interface VehicleFareInput {
  vehicleTypeId: number;
}

export const useMultipleVehiclesFare = ({
  vehicles,
  bookingTime,
  isReturn = false,
  bookingDate,
}: {
  vehicles: VehicleFareInput[];
  bookingTime: any;
  isReturn?: boolean;
  bookingDate?: string;
}) => {
  const distance = useBookingStore((state: BookingState) =>
    isReturn ? state?.returnDistance : state?.distance
  );
  const [debouncedDistance, setDebouncedDistance] = useState(0);
  const [fare, setFare] = useState<number | null>(null);
  const [fareReasons, setFareReasons] = useState<string[]>([]);
  const returnDistance = useBookingStore((state: BookingState) => state?.returnDistance);

  const isDaytime = (time: any) => {
    const hours = dayjs(time)?.hour();
    const minutes = dayjs(time)?.minute();
    return (
      (hours > 7 || (hours === 7 && minutes >= 0)) && (hours < 24 || (hours === 23 && minutes < 60))
    );
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isReturn) {
        setDebouncedDistance(returnDistance);
      } else {
        setDebouncedDistance(distance);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [distance, returnDistance]);
  const calculateFareForVehicle = ({
    dist,
    regularFair,
    customRegularFairs,
    longRangeFairs,
    meterStartData,
  }: {
    dist: number;
    regularFair: any;
    customRegularFairs: any;
    longRangeFairs: any;
    meterStartData: any;
  }) => {
    const date = dayjs(bookingDate)?.format('YYYY-MM-DD');
    const day = isDaytime(bookingTime);

    // 1. Check LongRangeFair (includes CustomLongRangeFairs)
    for (const fair of longRangeFairs || []) {
      const inDistance =
        dist >= fair?.minDistance && (!fair?.maxDistance || dist <= fair?.maxDistance);

      if (!inDistance) continue;

      // Check if any active CustomLongRangeFair applies for this range
      const activeCustom = (fair?.CustomLongRangeFair || [])?.find((cf: any) => {
        const start = dayjs(cf?.startDate).format('YYYY-MM-DD');
        const endExclusive = dayjs(cf?.endDate).add(1, 'millisecond').format('YYYY-MM-DD');

        return date >= start && date < endExclusive;
      });

      if (activeCustom) {
        return {
          meterStart: day ? meterStartData?.morningPrice : meterStartData?.eveningPrice,
          ratePerMile: day ? activeCustom?.morningPricePerMile : activeCustom?.eveningPricePerMile,
          reason: activeCustom?.reason || undefined,
        };
      }

      // No matching custom fair, use base LongRangeFair
      return {
        meterStart: day ? meterStartData?.morningPrice : meterStartData?.eveningPrice,
        ratePerMile: day ? fair?.morningPricePerMile : fair?.eveningPricePerMile,
      };
    }

    //     // 2. CustomRegularFair (date range + status)
    const activeCustomRegular = customRegularFairs?.find((f: any) => {
      const start = dayjs(f?.startDate).format('YYYY-MM-DD');
      const endExclusive = dayjs(f?.endDate).add(1, 'millisecond').format('YYYY-MM-DD');

      return date >= start && date < endExclusive;
    });

    if (activeCustomRegular) {
      return {
        meterStart: day ? meterStartData?.morningPrice : meterStartData?.eveningPrice,
        ratePerMile: day
          ? activeCustomRegular?.morningPricePerMile
          : activeCustomRegular?.eveningPricePerMile,
        reason: activeCustomRegular?.reason || undefined,
      };
    }

    if (
      regularFair &&
      (regularFair?.morningPricePerMile != null || regularFair?.eveningPricePerMile != null)
    ) {
      return {
        meterStart: day ? meterStartData?.morningPrice : meterStartData?.eveningPrice,
        ratePerMile: day ? regularFair?.morningPricePerMile : regularFair?.eveningPricePerMile,
      };
    }

    // 4. If everything is null, return nulls (will be handled by default fare)
    return {
      meterStart: null,
      ratePerMile: null,
    };
  };

  const fareDataQueries: any = useFareData(vehicles);

  useEffect(() => {
    if (debouncedDistance > 0 && bookingTime && fareDataQueries?.length) {
      let totalFareSum = 0;
      const reasons: string[] = [];

      for (const queryFaresData of fareDataQueries) {
        if (!queryFaresData) continue;

        const { meterStart, ratePerMile, reason } = calculateFareForVehicle({
          dist: debouncedDistance,
          regularFair: queryFaresData?.regularFair,
          customRegularFairs: queryFaresData?.customRegularFairs ?? [],
          longRangeFairs: queryFaresData?.longRangeFairs ?? [],
          meterStartData: queryFaresData?.meterStartData ?? {},
        });

        if (ratePerMile == null) continue;

        let totalFareForVehicle = 0;

        if (meterStart != null) {
          totalFareForVehicle += meterStart;
          if (debouncedDistance > 1) {
            totalFareForVehicle += (debouncedDistance - 1) * ratePerMile;
          }
        } else {
          totalFareForVehicle = debouncedDistance * ratePerMile;
        }

        totalFareSum += totalFareForVehicle;

        // collect reason if exists
        if (reason) {
          reasons.push(reason);
        }
      }

      setFare(totalFareSum);
      setFareReasons(reasons);
    }
  }, [debouncedDistance, bookingTime, fareDataQueries, bookingDate]);

  return { totalFare: fare, reasons: fareReasons };
};
