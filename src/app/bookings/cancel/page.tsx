import React from 'react';
import { CloseCircleOutlined } from '@ant-design/icons';
import { Result } from 'antd';

export const metadata = {
  title: 'Arrow Taxi - Failed Payment',
};

const page = () => {
  return (
    <div className=" h-screen w-full flex justify-center items-center flex-col">
      <Result
        icon={<CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: 64 }} />}
        title={<h2 style={{ color: '#262626', marginBottom: 8 }}>Payment Cancelled!</h2>}
        subTitle={<p style={{ fontSize: 16 }}>Your payment was cancelled. No charges were made.</p>}
      />
      {/* <p>Don&apos;t worry! You can try again or contact us if you need assistance.</p> */}
    </div>
  );
};

export default page;
