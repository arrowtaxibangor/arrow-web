/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Form, Image } from 'antd';
import React from 'react';
import { baseurl } from '../../../utils/axios';
import { DollarOutlined, MinusOutlined, PlusOutlined, ProfileOutlined } from '@ant-design/icons';
import { useMultipleVehiclesFare } from '../../../utils/useCalculateMultiVehicleFare';

const VehicleTypeCard = ({
  vehicle,
  isReturn,
  bookingTime,
  getVehicleCount,
  handleVehicleSelect,
  handleVehicleDecrement,
  form,
}: {
  vehicle: any;
  isReturn: boolean;
  bookingTime: any;
  getVehicleCount: any;
  handleVehicleSelect: any;
  handleVehicleDecrement: any;
  form?: any;
}) => {
  const allValues: any = Form.useWatch([], form);
  const bookingDate = allValues?.date;
  const count = getVehicleCount(vehicle?.vehicleTypeId);
  const isSelected = count > 0;

  // Calculate fares for all vehicles
  const { totalFare } = useMultipleVehiclesFare({
    vehicles: [vehicle],
    bookingTime,
    isReturn,
    bookingDate,
  });
  let fare;
  if (totalFare) {
    if (count > 0) {
      fare = `£${(count * totalFare).toFixed(2)}`;
    } else {
      fare = `£${totalFare.toFixed(2)}`;
    }
  } else {
    fare = 'N/A';
  }

  const vehicleWithFare = {
    ...vehicle,
    perVehiclePrice: totalFare,
  };

  return (
    <div
      onClick={() => handleVehicleSelect(vehicleWithFare)}
      className={`rounded-xl p-[14px] cursor-pointer transition-all duration-300 ${
        isSelected ? '' : 'bg-white border border-[#e0e0e0] shadow-md'
      }`}
      style={{
        backgroundColor: isSelected ? '#bde0fe' : '#fff',
        borderColor: isSelected ? '#bde0fe' : '#e0e0e0',
        boxShadow: isSelected ? '0 4px 12px rgba(189, 224, 254, 0.6)' : '0 2px 8px rgba(0,0,0,0.1)',
        width: '140px',
      }}
    >
      {vehicle?.vehicleIcon && (
        <div className="flex justify-center items-center w-full pb-2">
          <div className="!h-[100px] !-w-[100px]">
            <Image
              preview={false}
              alt={vehicle?.vehicleType}
              src={`${baseurl}/${vehicle?.vehicleIcon}`}
              className="!h-[100px] !w-full !object-contain"
            />
          </div>
        </div>
      )}
      {/* Vehicle Type */}
      <div className="flex justify-center items-center gap-1 mb-2">
        <p className="text-[18px] font-bold m-0 truncate text-[#333]">{vehicle?.vehicleType}</p>
      </div>

      {/* Seats Info */}
      <div className="flex items-center gap-2 mb-3">
        <ProfileOutlined className="!text-[15px]" color="#666" />
        <span className="text-[14px] text-[#666]">{vehicle?.noOfSeats} seats</span>
      </div>

      {/* Fare Info */}
      <div className="flex items-center gap-2 mb-3">
        <DollarOutlined className="!text-[15px]" color="#666" />
        <span className="text-[14px] text-[#666] font-semibold">{fare}</span>
      </div>

      {/* Count Controls */}
      {isSelected ? (
        <div className="flex items-center gap-2 bg-white/20 rounded-lg p-[6px] justify-center">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleVehicleDecrement(vehicle?.vehicleTypeId);
            }}
            className="bg-white/30 border-none rounded-md w-7 h-7 flex items-center justify-center text-[#333]"
          >
            <MinusOutlined size={14} />
          </Button>

          <span className="text-[#333] font-bold min-w-[20px] text-center">{count}</span>

          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleVehicleSelect(vehicleWithFare);
            }}
            className="bg-white/30 border-none rounded-md w-7 h-7 flex items-center justify-center text-[#333]"
          >
            <PlusOutlined size={14} />
          </Button>
        </div>
      ) : (
        <div className="text-center text-[#999] text-[13px] p-[6px]">Tap to select</div>
      )}
    </div>
  );
};

export default VehicleTypeCard;
