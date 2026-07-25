/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from 'react';
import { useInfiniteQuery } from 'react-query';
import { AxiosError } from 'axios';
import { Form, message } from 'antd';
import VehicleTypeCard from './VehicleTypeCard';
import { useMultipleVehiclesFare } from '../../../utils/useCalculateMultiVehicleFare';
import { getVehicleTypes } from '../../../services/vehicles';

const SaloonAutoSelector = ({
  saloon,
  onVehiclesChange,
  setSelectedVehicleTypes,
  hasAutoSelectedRef,
  bookingTime,
  isReturn,
  form,
}: any) => {
  const allValues: any = Form.useWatch([], form);
  const bookingDate = allValues?.date;

  const { totalFare } = useMultipleVehiclesFare({
    vehicles: [saloon],
    bookingTime,
    isReturn,
    bookingDate,
  });

  useEffect(() => {
    if (totalFare !== null && totalFare !== undefined) {
      onVehiclesChange([{ ...saloon, quantity: 1, perVehiclePrice: totalFare }]);
      setSelectedVehicleTypes([saloon]);
      hasAutoSelectedRef.current = true;
    }
  }, [totalFare, saloon, onVehiclesChange, setSelectedVehicleTypes, hasAutoSelectedRef]);

  return null;
};

export const VehicleSelectionCards = ({
  isReturn,
  bookingTime,
  noOfPassengers,
  selectedVehicles,
  onVehiclesChange,
  selectedVehicleTypes,
  setSelectedVehicleTypes,
  form,
}: {
  isReturn: boolean;
  bookingTime: any;
  noOfPassengers: any;
  selectedVehicles: any;
  onVehiclesChange: any;
  selectedVehicleTypes: any;
  setSelectedVehicleTypes: any;
  form?: any;
}) => {
  const hasAutoSelectedRef = React.useRef(false);
  const [saloonToAutoSelect, setSaloonToAutoSelect] = useState<any>(null);
  //test
  const { data: vehicleTypeOptions } = useInfiniteQuery(
    ['get-vehicle-types'],
    ({ pageParam = 0 }) =>
      getVehicleTypes({
        skip: pageParam,
        take: 10,
        isAllTypes: false,
      }),
    {
      getNextPageParam: (lastPage) => lastPage?.nextFrom ?? null,
      onError: (err: AxiosError<any>) => {
        message.error(err?.response?.data?.message);
      },
      staleTime: Infinity,
      cacheTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 1,
    }
  );

  const allVehicleTypes = vehicleTypeOptions?.pages?.flatMap((page) =>
    page?.vehicleTypes?.map((vehicle: any) => ({
      vehicleTypeId: vehicle?.id,
      vehicleIcon: vehicle?.VehicleIcon?.url,
      vehicleType: vehicle?.vehicleType,
      noOfSeats: vehicle?.noOfSeats,
      fair: {
        morningPricePerMile: vehicle?.RegularFair?.morningPricePerMile,
        eveningPricePerMile: vehicle?.RegularFair?.eveningPricePerMile,
      },
    }))
  );

  // Calculate total seats covered
  const totalSeatsCovered = useMemo(
    () => selectedVehicles.reduce((t: number, v: any) => t + v.noOfSeats * v.quantity, 0),
    [selectedVehicles]
  );

  // Calculate remaining passengers
  const remainingPassengers = Math.max(0, noOfPassengers - totalSeatsCovered);

  useEffect(() => {
    if (!allVehicleTypes?.length) return;

    // Avoid re-selecting if already selected
    if (hasAutoSelectedRef.current) return;

    const saloon = allVehicleTypes.find((v: any) => v.vehicleType?.toLowerCase() === 'saloon');

    if (saloon) {
      setSaloonToAutoSelect(saloon);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allVehicleTypes]);

  // Handle vehicle selection/increment - adds a NEW object instead of incrementing quantity
  const handleVehicleSelect = (vehicleType: any) => {
    if (remainingPassengers <= 0) {
      message.warning('You have selected enough vehicles to seat all your passengers.');
      return;
    }

    // --- For quantity stored version ---
    const exists = selectedVehicles.find((v: any) => v.vehicleTypeId === vehicleType.vehicleTypeId);

    if (exists) {
      onVehiclesChange(
        selectedVehicles.map((v: any) =>
          v.vehicleTypeId === vehicleType.vehicleTypeId
            ? { ...v, quantity: v.quantity + 1, perVehiclePrice: vehicleType?.perVehiclePrice }
            : v
        )
      );
    } else {
      onVehiclesChange([...selectedVehicles, { ...vehicleType, quantity: 1 }]);
    }

    // --- For duplicated array version ---
    setSelectedVehicleTypes([...selectedVehicleTypes, vehicleType]);
  };

  // Handle vehicle decrement - removes the LAST occurrence of this vehicle type
  const handleVehicleDecrement = (vehicleTypeId: any) => {
    // --- Decrease quantity or remove completely ---
    const updated = selectedVehicles
      .map((v: any) => (v.vehicleTypeId === vehicleTypeId ? { ...v, quantity: v.quantity - 1 } : v))
      .filter((v: any) => v.quantity > 0);

    onVehiclesChange(updated);

    // --- Remove one duplicate entry from selectedVehicleTypes ---
    const indexToRemove = selectedVehicleTypes.findIndex(
      (v: any) => v.vehicleTypeId === vehicleTypeId
    );

    if (indexToRemove !== -1) {
      const updatedDuplicates = [...selectedVehicleTypes];
      updatedDuplicates.splice(indexToRemove, 1);
      setSelectedVehicleTypes(updatedDuplicates);
    }
  };

  // Get count (quantity) for a specific vehicle type
  const getVehicleCount = (id: any) =>
    selectedVehicles.find((v: any) => v.vehicleTypeId === id)?.quantity || 0;

  // Calculate total vehicles selected
  const totalVehicles = selectedVehicles.length;

  if (noOfPassengers === 0) {
    return (
      <div
        style={{
          marginBottom: '24px',
          padding: '16px',
          backgroundColor: '#E3F2FD',
          borderRadius: '8px',
          border: '1px solid #90CAF9',
        }}
      >
        <p style={{ textAlign: 'center', color: '#1565C0', margin: 0 }}>
          Please select number of passengers to see available vehicles
        </p>
      </div>
    );
  }

  if (allVehicleTypes?.length === 0) {
    return (
      <div style={{ marginBottom: '24px', padding: '16px', textAlign: 'center' }}>
        <p style={{ color: '#fff', margin: 0 }}>No vehicles available</p>
      </div>
    );
  }

  return (
    <>
      {saloonToAutoSelect && (
        <SaloonAutoSelector
          saloon={saloonToAutoSelect}
          onVehiclesChange={onVehiclesChange}
          setSelectedVehicleTypes={setSelectedVehicleTypes}
          hasAutoSelectedRef={hasAutoSelectedRef}
          bookingTime={bookingTime}
          isReturn={isReturn}
          form={form}
        />
      )}
      <div className="mb-6">
        {/* Header */}
        <div className="mb-5">
          <h3 className="text-white text-[18px] font-bold m-0">Select Vehicles</h3>
        </div>

        {/* Vehicle Cards */}
        <div className="flex flex-wrap gap-4 mb-4 mobile:justify-center">
          {allVehicleTypes?.map((vehicle) => (
            <VehicleTypeCard
              key={vehicle?.vehicleTypeId}
              vehicle={vehicle}
              isReturn={isReturn}
              bookingTime={bookingTime}
              getVehicleCount={getVehicleCount}
              handleVehicleSelect={handleVehicleSelect}
              handleVehicleDecrement={handleVehicleDecrement}
              form={form}
            />
          ))}
        </div>

        {/* Summary */}
        {selectedVehicles.length > 0 && (
          <div className="bg-white rounded-xl p-4 mb-4">
            <div className="flex justify-between items-center">
              <h4 className="text-[14px] font-bold text-[#333] mb-2">Selected Vehicles</h4>
              {totalVehicles > 0 && (
                <p className="text-[#64b5f6] text-[14px] mt-0 mb-[8px]">
                  {totalVehicles} vehicle{totalVehicles > 1 ? 's' : ''} selected
                </p>
              )}
            </div>

            {/* Group vehicles by type for display */}
            {allVehicleTypes
              ?.filter((vType: any) => getVehicleCount(vType?.vehicleTypeId) > 0)
              ?.map((vType: any) => {
                const count = getVehicleCount(vType?.vehicleTypeId);
                return (
                  <div
                    key={vType?.vehicleTypeId}
                    className="flex justify-between py-[6px] border-b border-[#eee] text-[13px]"
                  >
                    <span className="text-[#333]">
                      {vType?.vehicleType} × {count}
                    </span>
                    <span className="text-[#2196F3] font-bold">
                      {count * vType?.noOfSeats} seats
                    </span>
                  </div>
                );
              })}

            <div className="flex justify-between pt-3 text-[14px] font-bold text-[#333]">
              <span>Total Seats:</span>
              <span className="text-[#2196F3]">{totalSeatsCovered}</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
