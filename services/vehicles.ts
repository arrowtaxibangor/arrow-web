/* eslint-disable @typescript-eslint/no-explicit-any */
import { axios, baseurl } from '../utils/axios';

export const getVehicleTypes = async ({
  skip,
  take,
  search,
  isAllTypes,
}: {
  skip: number;
  take: number;
  search?: string;
  isAllTypes: boolean;
}) => {
  const params = new URLSearchParams();

  // Always add required params
  params.append('skip', String(skip));
  params.append('take', String(take));
  params.append('isAllTypes', String(isAllTypes));

  // Add only if search has value
  if (search) {
    params.append('search', search);
  }

  return await axios.get(`${baseurl}/vehicle-type?${params.toString()}`).then((res) => res.data);
};

export const getVehicles = async ({
  vehicleTypeId,
  skip,
  take,
  search,
}: {
  vehicleTypeId: any;
  skip: number;
  take: number;
  search?: string;
}) => {
  const params = new URLSearchParams({
    skip: String(skip),
    take: String(take),
    vehicleTypeId: String(vehicleTypeId),
    search: String(search),
  });

  return await axios.get(`${baseurl}/vehicles?${params.toString()}`).then((res) => res.data);
};

export const getSuggestedVehicles = async ({
  numberOfPassengers,
}: {
  numberOfPassengers: number;
}) => {
  return await axios
    .post(`${baseurl}/booking/suggest-vehicles`, { numberOfPassengers })
    .then((res) => res.data);
};
