/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Select } from 'antd';
import React from 'react';

const VehicleTypeSelect = ({
  options,
  value,
  onChange,
  setSearchString,
}: {
  options: any;
  value?: any;
  onChange?: any;
  setSearchString?: any;
}) => {
  return (
    <Select
      placeholder="Vehicle Type"
      className="!rounded-[2px] !w-full"
      options={options}
      value={value}
      // onChange={onChange}
      filterOption={false}
      onSearch={(e: string) => setSearchString(e)}
      onChange={(v) => {
        onChange?.(v);
        setSearchString('');
      }}
      showSearch
      allowClear
    />
  );
};

export default VehicleTypeSelect;
