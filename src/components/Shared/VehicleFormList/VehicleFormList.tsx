/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { Button, message, Form } from 'antd';
import React, { useMemo, useState, useEffect } from 'react';
import VehicleTypeSelect from '../VehicleTypeSelect/VehicleTypeSelect';
import VehicleSelect from '../VehicleSelect/VehicleSelect';
import { useInfiniteQuery } from 'react-query';
import { getVehicles, getVehicleTypes } from '../../../../services/vehicles';
import { AxiosError } from 'axios';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import useDebounce from '../../../../Hooks/useDebounce';

interface VehicleFormListProps {
  isReturn: boolean;
  selectedVehicle?: { vehicleTypeId: number; vehicleId: number; seats: number } | null;
  onVehicleAdded?: () => void;
  onVehicleRemoved?: (vehicleId: number) => void;
}

const VehicleFormList = ({
  isReturn,
  selectedVehicle,
  onVehicleAdded,
  onVehicleRemoved,
}: VehicleFormListProps) => {
  const [vehicleTypeId, setVehicleTypeId] = useState<any>();
  const [searchString, setSearchString] = useState<string | null>('');
  const debouncedSearch = useDebounce(searchString, 300);
  const [searchVehicleTypeString, setSearchVehicleTypeString] = useState<string | null>('');
  const debouncedVehicleTypeSearch = useDebounce(searchVehicleTypeString, 300);
  const form = Form.useFormInstance();

  const {
    data: vehicleTypeOptions,
    hasNextPage: hasNextPageVehicleTypes,
    fetchNextPage: fetchNextPageVehicleTypes,
    isLoading: loadingVehicleTypes,
    isFetching: fetchingVehicleTypes,
  } = useInfiniteQuery(
    ['get-vehicle-types', debouncedVehicleTypeSearch],
    ({ pageParam = 0 }) =>
      getVehicleTypes({
        skip: pageParam,
        take: 10,
        search: debouncedVehicleTypeSearch,
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

  const {
    data: vehicleOptions,
    hasNextPage: hasNextPageVehicles,
    fetchNextPage: fetchNextPageVehicles,
    isLoading: loadingVehicles,
    isFetching: fetchingVehicles,
  } = useInfiniteQuery(
    ['get-vehicles', vehicleTypeId, debouncedSearch],
    ({ pageParam = 0 }) =>
      getVehicles({
        vehicleTypeId,
        skip: pageParam,
        take: 10,
        search: debouncedSearch,
      }),
    {
      getNextPageParam: (lastPage) => lastPage?.nextFrom ?? null,
      onError: (err: AxiosError<any>) => {
        message.error(err?.response?.data?.message);
      },
      enabled: !!vehicleTypeId,
      staleTime: Infinity,
      cacheTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 1,
    }
  );

  // Handle auto-selection when a suggested vehicle is clicked
  useEffect(() => {
    if (selectedVehicle) {
      const fieldName = !isReturn ? 'vehicles' : 'returnVehicles';
      const currentVehicles = form.getFieldValue(fieldName) || [{}];

      // Find the first empty slot or add a new one
      const emptyIndex = currentVehicles.findIndex(
        (v: any) =>
          !v?.vehicleTypeId && !v?.vehicleId && !v?.returnVehicleTypeId && !v?.returnVehicleId
      );

      if (emptyIndex !== -1) {
        // Fill the empty slot
        const updatedVehicles = [...currentVehicles];
        updatedVehicles[emptyIndex] = {
          [!isReturn ? 'vehicleTypeId' : 'returnVehicleTypeId']: selectedVehicle.vehicleTypeId,
          [!isReturn ? 'vehicleId' : 'returnVehicleId']: selectedVehicle.vehicleId,
        };
        form.setFieldValue(fieldName, updatedVehicles);
      } else {
        // Add a new vehicle
        const newVehicle = {
          [!isReturn ? 'vehicleTypeId' : 'returnVehicleTypeId']: selectedVehicle.vehicleTypeId,
          [!isReturn ? 'vehicleId' : 'returnVehicleId']: selectedVehicle.vehicleId,
        };
        form.setFieldValue(fieldName, [...currentVehicles, newVehicle]);
      }

      // Set the vehicle type ID for loading vehicles
      setVehicleTypeId(selectedVehicle.vehicleTypeId);

      // Notify parent that vehicle was added
      onVehicleAdded?.();
    }
  }, [selectedVehicle, form, isReturn, onVehicleAdded]);

  const allVehicleTypes = useMemo(() => {
    const vehicles =
      vehicleTypeOptions?.pages?.flatMap((page) =>
        page?.vehicleTypes?.map((vehicle: any) => ({
          label: `${vehicle?.vehicleType} - ${vehicle?.noOfSeats} seats`,
          value: vehicle?.id,
          noOfSeats: vehicle?.noOfSeats,
        }))
      ) || [];

    if (hasNextPageVehicleTypes) {
      vehicles.push({
        label: (
          <div className="flex justify-start items-start w-full">
            <Button
              type="link"
              disabled={loadingVehicleTypes || fetchingVehicleTypes}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                fetchNextPageVehicleTypes();
              }}
              className="w-full"
            >
              {loadingVehicleTypes || fetchingVehicleTypes ? 'Loading...' : 'Load More'}
            </Button>
          </div>
        ),
        value: 'loadMore',
        disabled: true,
      });
    }

    return vehicles;
  }, [
    vehicleTypeOptions?.pages,
    hasNextPageVehicleTypes,
    loadingVehicleTypes,
    fetchingVehicleTypes,
    fetchNextPageVehicleTypes,
  ]);

  const allVehicle = useMemo(() => {
    const vehicles =
      vehicleOptions?.pages?.flatMap((page) =>
        page?.vehicles?.map((vehicle: any) => ({
          label: vehicle?.name,
          value: vehicle?.id,
        }))
      ) || [];

    if (hasNextPageVehicles) {
      vehicles.push({
        label: (
          <div className="flex justify-start items-start w-full">
            <Button
              type="link"
              disabled={loadingVehicles || fetchingVehicles}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                fetchNextPageVehicles();
              }}
              className="w-full"
            >
              {loadingVehicles || fetchingVehicles ? 'Loading...' : 'Load More'}
            </Button>
          </div>
        ),
        value: 'loadMore',
        disabled: true,
      });
    }

    return vehicles;
  }, [
    vehicleOptions?.pages,
    hasNextPageVehicles,
    loadingVehicles,
    fetchingVehicles,
    fetchNextPageVehicles,
  ]);

  return (
    <Form.List name={!isReturn ? 'vehicles' : 'returnVehicles'} initialValue={[{}]}>
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name, ...restField }, index) => (
            <div
              key={key}
              className="relative bg-[#1e4b8a] p-4 rounded-md mb-4 border border-[#5a7ab9]"
            >
              {/* Vehicle Number Header */}
              <div className="flex justify-between items-center mb-3">
                <span className="text-white font-semibold text-[16px]">Vehicle {index + 1}</span>
                {fields.length > 1 && (
                  <Button
                    type="text"
                    danger
                    icon={<MinusCircleOutlined />}
                    onClick={() => {
                      // Get the vehicle ID before removing
                      const fieldName = !isReturn ? 'vehicles' : 'returnVehicles';
                      const currentVehicles = form.getFieldValue(fieldName) || [];
                      const vehicleId =
                        currentVehicles[name]?.[!isReturn ? 'vehicleId' : 'returnVehicleId'];

                      // Remove from form
                      remove(name);

                      // Notify parent to restore the tag
                      if (vehicleId && onVehicleRemoved) {
                        onVehicleRemoved(vehicleId);
                      }
                    }}
                    className="!text-red-400 hover:!text-red-300"
                  >
                    Remove
                  </Button>
                )}
              </div>

              {/* Vehicle Type Select */}
              <Form.Item
                {...restField}
                label="Vehicle Type"
                name={[name, !isReturn ? 'vehicleTypeId' : 'returnVehicleTypeId']}
                className="!mb-[10px]"
                rules={[
                  {
                    required: true,
                    message: 'Select your Vehicle Type',
                  },
                ]}
              >
                <VehicleTypeSelect
                  options={allVehicleTypes}
                  onChange={(e: any) => setVehicleTypeId(e)}
                  setSearchString={setSearchVehicleTypeString}
                />
              </Form.Item>

              {/* Vehicle Select */}
              <Form.Item
                {...restField}
                label="Vehicle"
                name={[name, !isReturn ? 'vehicleId' : 'returnVehicleId']}
                className="!mb-0"
                rules={[
                  {
                    required: true,
                    message: 'Please select Vehicle',
                  },
                ]}
              >
                <VehicleSelect
                  options={allVehicle}
                  setSearchString={setSearchString}
                  disable={vehicleTypeId ? false : true}
                />
              </Form.Item>
            </div>
          ))}

          {/* Add Vehicle Button */}
          <Form.Item className="!mb-4">
            <Button
              type="dashed"
              onClick={() => add()}
              block
              icon={<PlusOutlined />}
              className="!border-[#5a7ab9] hover:!border-[#3b82f6] !text-[#3b82f6]"
            >
              Add Another Vehicle
            </Button>
          </Form.Item>
        </>
      )}
    </Form.List>
  );
};

export default VehicleFormList;
