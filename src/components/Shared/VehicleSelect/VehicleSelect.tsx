/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Select } from 'antd';
import React from 'react';

const VehicleSelect = ({
  options,
  value,
  disable,
  onChange,
  setSearchString,
}: {
  options: any;
  value?: any;
  disable?: any;
  onChange?: any;
  setSearchString?: any;
}) => {
  return (
    <Select
      placeholder="Vehicle Type"
      className={`!rounded-[2px] !w-full ${disable && 'white-placeholder'}`}
      options={options}
      value={value}
      disabled={disable}
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

export default VehicleSelect;
