/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Axios from 'axios';

export const baseurl = process.env.NEXT_PUBLIC_BACKEND_URL;

const Token = async () => {
  try {
    const authData: any = localStorage.getItem('arrow-taxi');
    const parsedData: any = JSON.parse(authData);
    return parsedData.token;
  } catch (err) {
    return null;
  }
};

export const axios = Axios.create({
  baseURL: baseurl,
});

axios.interceptors.request.use(async (config: any) => {
  config.headers = {
    'auth-token': await Token(),
  };
  return config;
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('arrow-taxi');

      if (error?.response?.data?.message !== 'Invalid credentials!') {
        window.location.replace('/');
      }
    }
    throw error;
  }
);
