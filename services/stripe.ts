/* eslint-disable @typescript-eslint/no-explicit-any */
import { axios } from '../utils/axios';

export const getSuccess = async (id: string | any) => {
  return await axios.get(`/booking/success/${id}`).then((res) => res.data);
};
