import { axios } from '../utils/axios';

// GET Setting
export const getSetting = async () => {
  return await axios.get('/setting').then((res) => res.data.setting);
};
