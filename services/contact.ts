import { axios } from '../utils/axios';

export const sendContactMessage = async (formData: {
  name: string;
  email: string;
  phone: string;
  message: string;
}) => {
  return await axios.post('/contact', formData).then((res) => res?.data);
};
