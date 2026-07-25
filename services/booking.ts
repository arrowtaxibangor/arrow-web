import { axios, baseurl } from '../utils/axios';

/* eslint-disable @typescript-eslint/no-explicit-any */
export const createBooking = async (data: any): Promise<any> => {
  const response = await axios.post(`${baseurl}/booking`, data);
  return response.data;
};

export const getBookingById = async (bookingId: number) => {
  return await axios.get(`${baseurl}/booking/${bookingId}`).then((res) => res.data);
};

export const getBookingDriverById = async (bookingId: any, driverId: string | null) => {
  return await axios
    .get(
      `${baseurl}/booking/driver/${bookingId}?driverId=${driverId}
`
    )
    .then((res) => res.data);
};

export const updateBookingDriverById = async (
  bookingId: any,
  chargedAmount: any,
  driverId: any
) => {
  return await axios
    .patch(
      `${baseurl}/booking/driver/${bookingId}
`,
      { chargedAmount, driverId }
    )
    .then((res) => res.data);
};
