/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect, forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import { Button } from 'antd';

interface ASAPTimePickerProps {
  value: dayjs.Dayjs;
  onChange: (value: dayjs.Dayjs) => void;
  onASAPClick?: () => void; // 👈 new prop
}

export default function ASAPTimePicker({ value, onChange, onASAPClick }: ASAPTimePickerProps) {
  const [showASAP, setShowASAP] = useState<boolean>(true);

  useEffect(() => {
    // On mount or value change, decide whether to show ASAP
    if (value?.isSame(dayjs(), 'minute')) {
      setShowASAP(true);
    } else {
      setShowASAP(false);
    }
  }, [value]);

  const handleChange = (date: Date | null) => {
    if (date) {
      const selected = dayjs(date);
      if (selected?.isSame(dayjs(), 'minute')) {
        setShowASAP(true);
      } else {
        setShowASAP(false);
      }
      onChange(selected);
    }
  };

  const handleASAPClick = () => {
    const now = dayjs();
    onChange(now);
    setShowASAP(true);
    if (onASAPClick) {
      onASAPClick(); // also update date in parent
    }
  };

  const CustomInput = forwardRef<HTMLInputElement, any>(({ value, onClick }, ref) => (
    <input
      readOnly
      ref={ref}
      onClick={onClick}
      value={showASAP ? 'ASAP' : value}
      className="time-input pl-2 !w-full"
    />
  ));
  CustomInput.displayName = 'CustomInput';

  return (
    <div className="flex space-x-2 items-center relative !z-40 bg-white min-h-[34.7px] border-[1px] border-solid border-[#d9d9d9] rounded-[2px]">
      <DatePicker
        selected={value?.toDate()}
        onChange={handleChange}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={5}
        dateFormat="HH:mm"
        timeFormat="HH:mm"
        customInput={<CustomInput />}
        className="!w-full"
      />
      {!showASAP && (
        <Button
          type="primary"
          onClick={handleASAPClick}
          className="absolute right-[-1px] !rounded-l-[0px] !rounded-r-[2px] min-h-[34.7px]"
        >
          ASAP
        </Button>
      )}
    </div>
  );
}
