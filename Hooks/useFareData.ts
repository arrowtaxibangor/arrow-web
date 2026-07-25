/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useQueries, useQuery } from 'react-query';
import { axios } from '../utils/axios';
import { message } from 'antd';
import { useMemo } from 'react';

export const useFareData = (vehicles: any[]) => {
  // ✅ Check if there is at least one valid vehicleTypeId
  const hasVehicleTypeIds =
    Array.isArray(vehicles) &&
    vehicles?.some((item) => item?.vehicleTypeId || item?.returnVehicleTypeId);

  // ✅ CASE 1: If we have vehicle type IDs → run multiple queries (your existing logic)
  const queries = useQueries(
    (hasVehicleTypeIds ? vehicles : [])?.map((item) => {
      const vehicleTypeId = item?.vehicleTypeId || item?.returnVehicleTypeId;

      return {
        queryKey: ['fareData', vehicleTypeId],
        queryFn: async () => {
          const [regularFair, customRegularFairs, longRangeFairs, meterStartData] =
            await Promise.allSettled([
              axios
                .get(`/fair/regular/vehicleTypeId`, { params: { vehicleTypeId } })
                .then((res) => res.data),
              axios
                .get(`/fair/regular/custom/vehicleTypeId`, { params: { vehicleTypeId } })
                .then((res) => res.data),
              axios
                .get(`/fair/long-range/vehicleTypeId`, { params: { vehicleTypeId } })
                .then((res) => res.data),
              axios
                .get(`/fair/meter-start/vehicleTypeId`, { params: { vehicleTypeId } })
                .then((res) => res.data),
            ]);
          return {
            regularFair: regularFair.status === 'fulfilled' ? regularFair?.value : null,
            customRegularFairs:
              customRegularFairs.status === 'fulfilled' ? customRegularFairs?.value : null,
            longRangeFairs: longRangeFairs.status === 'fulfilled' ? longRangeFairs?.value : null,
            meterStartData: meterStartData.status === 'fulfilled' ? meterStartData?.value : null,
          };
        },
        enabled: !!vehicleTypeId && vehicles?.length > 0, // ✅ only runs when valid
        onError: (err: any) => {
          message.error(err?.response?.data?.message || 'Failed to fetch fare data');
        },
      };
    })
  );

  // ✅ CASE 2: If NO vehicle type IDs → fetch default/global fares (no params)
  const defaultFareQuery = useQuery(
    ['fareData', 'default'],
    async () => {
      const [regularFair, customRegularFairs, longRangeFairs, meterStartData] =
        await Promise.allSettled([
          axios.get(`/fair/regular`).then((res) => res.data),
          axios.get(`/fair/regular/custom`).then((res) => res.data),
          axios.get(`/fair/long-range`).then((res) => res.data),
          axios.get(`/fair/meter-start`).then((res) => res.data),
        ]);

      return {
        regularFair: regularFair.status === 'fulfilled' ? regularFair?.value?.fair : null,
        customRegularFairs:
          customRegularFairs.status === 'fulfilled' ? customRegularFairs?.value?.fairs : null,
        longRangeFairs: longRangeFairs.status === 'fulfilled' ? longRangeFairs?.value?.fairs : null,
        meterStartData:
          meterStartData.status === 'fulfilled' ? meterStartData?.value?.meterStart : null,
      };
    },
    {
      enabled: !hasVehicleTypeIds, // ✅ only runs when no vehicleTypeIds are provided
      onError: (err: any) => {
        message.error(err?.response?.data?.message || 'Failed to fetch default fare data');
      },
    }
  );

  const queryData = queries.map((q) => q.data);
  const memoizedFareData = useMemo(() => {
    if (hasVehicleTypeIds) {
      return queryData.map((data) => {
        const isVehicleFareEmpty =
          !data ||
          (!data?.regularFair &&
            !data?.customRegularFairs?.length &&
            !data?.longRangeFairs?.length &&
            !data?.meterStartData);

        return isVehicleFareEmpty ? defaultFareQuery?.data : data;
      });
    }

    return [defaultFareQuery?.data];
  }, [hasVehicleTypeIds, defaultFareQuery?.data, JSON.stringify(queryData)]);

  return memoizedFareData;
};
