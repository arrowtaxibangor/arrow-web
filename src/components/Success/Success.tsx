'use client';
import React from 'react';
import { CheckCircleOutlined } from '@ant-design/icons';
import { Result, Spin } from 'antd';
import { useQuery } from 'react-query';
import { getSuccess } from '../../../services/stripe';
import { useSearchParams } from 'next/navigation';

const Success = () => {
  const params = useSearchParams();
  const id = params.get('session_id');

  const { isLoading: isLoadingBooking } = useQuery(['booking', id], () => getSuccess(id), {
    enabled: !!id,
  });

  return (
    <div className=" h-screen w-full flex justify-center items-center ">
      {isLoadingBooking ? (
        <Spin spinning />
      ) : (
        <Result
          icon={<CheckCircleOutlined style={{ color: '#52c41a', fontSize: 64 }} />}
          title={<h2 style={{ color: '#262626', marginBottom: 8 }}>Thank you!</h2>}
          subTitle={<p style={{ fontSize: 16 }}>Your payment has been processed successfully</p>}
        />
      )}
    </div>
  );
};

export default Success;
