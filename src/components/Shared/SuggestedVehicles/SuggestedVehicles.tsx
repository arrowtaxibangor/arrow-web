/* eslint-disable @typescript-eslint/no-explicit-any */
import { Tag } from 'antd';
import React from 'react';

interface SuggestedVehiclesProps {
  message: string;
  vehiclesList: any[];
  onVehicleSelect: (vehicleTypeId: number, vehicleId: number, seats: number) => void;
  remainingPassengers: number;
  selectedVehicleIds: number[];
}

const SuggestedVehicles = ({
  message,
  vehiclesList,
  onVehicleSelect,
  remainingPassengers,
  selectedVehicleIds,
}: SuggestedVehiclesProps) => {
  const availableVehicles = vehiclesList
    ?.map((item) => ({
      ...item,
      availableVehicles: item?.availableVehicles?.filter(
        (vehicle: any) => !selectedVehicleIds.includes(vehicle.id)
      ),
    }))
    .filter((item) => item?.availableVehicles?.length > 0);

  // Check if there are any available vehicles left
  const hasAvailableVehicles = availableVehicles?.some(
    (item) => item?.availableVehicles?.length > 0
  );
  return (
    <>
      <div className="w-full text-white text-[15px] leading-[15px] font-normal mb-2 mt-4">
        <p>{message}</p>
        {remainingPassengers > 0 && (
          <p className="text-[#FEC601] font-semibold mt-2">
            Remaining Passengers: {remainingPassengers}
          </p>
        )}
      </div>

      {hasAvailableVehicles ? (
        <div className="bg-[#1e4b8a] p-3 rounded-md flex flex-wrap gap-2 border border-[#5a7ab9] mb-4">
          {availableVehicles?.map((item) =>
            item?.availableVehicles?.map((vehicle: any) => (
              <Tag
                key={vehicle.id}
                color="blue"
                className="!border-none !bg-[#3b82f6]/20 !text-white !px-3 !py-[3px] !rounded-md cursor-pointer hover:!bg-[#3b82f6]/40 transition-all"
                onClick={() =>
                  onVehicleSelect(vehicle?.vehicleTypeId, vehicle?.id, item?.noOfSeats)
                }
              >
                {vehicle.name} - {item.noOfSeats} seats
              </Tag>
            ))
          )}
        </div>
      ) : (
        <div className="bg-[#1e4b8a] p-3 rounded-md border border-[#5a7ab9] mb-4">
          <p className="text-white/70 text-center text-sm">
            All suggested vehicles have been selected
          </p>
        </div>
      )}
    </>
  );
};

export default SuggestedVehicles;
