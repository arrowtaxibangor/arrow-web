/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React from 'react';
import { Form, InputNumber, message, Spin, Alert } from 'antd';
import { useMutation, useQuery } from 'react-query';
import { getBookingDriverById, updateBookingDriverById } from '../../../../services/booking';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

interface DriverCompletionFormProps {
  bookingId?: string;
}

const DriverCompletionForm: React.FC<DriverCompletionFormProps> = () => {
  const param = useParams();
  const searchParams = useSearchParams();

  const router = useRouter();
  const bookingId = param.id;
  const driverId = searchParams.get('driverId');
  const [form] = Form.useForm();
  const {
    data: booking,
    isLoading,
    error,
  } = useQuery(
    ['get-booking', bookingId, driverId],
    () => getBookingDriverById(bookingId, driverId),
    {
      enabled: !!bookingId && !!driverId,
      retry: 2,
      select: (res) => res.booking,
      onSuccess: (res: any) => {
        if (res?.chargedAmount)
          form.setFieldsValue({ chargedAmount: res?.VehicleTypes[0]?.perVehiclePrice });
      },
      onError: (err: any) => {
        message.error(err?.response?.data?.message || 'Failed to load booking details');
      },
    }
  );

  const { mutate, isLoading: mutateIsLoading } = useMutation(
    ({
      bookingId,
      chargedAmount,
      driverId,
    }: {
      bookingId: any;
      chargedAmount: any;
      driverId: any;
    }) => updateBookingDriverById(bookingId, chargedAmount, driverId),
    {
      onSuccess: (res: any) => {
        message.success(res?.message || 'Booking completed successfully!');
        form.resetFields();
        router.push('/');
      },
      onError: (err: any) => {
        message.error(err?.response?.data?.message || 'Failed to complete booking');
      },
    }
  );

  const handleSubmit = async (values: any) => {
    mutate({
      bookingId: bookingId,
      chargedAmount: values.chargedAmount,
      driverId: driverId,
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[rgb(38,94,166)] flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-8 shadow-lg text-center">
          <Spin size="large" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !booking) {
    return (
      <div className="min-h-screen bg-[rgb(38,94,166)] p-4 flex items-center justify-center">
        <div className="max-w-md w-full">
          <Alert
            message="Error Loading Booking"
            description="Unable to load booking details."
            type="error"
            showIcon
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full   pt-8">
      {/* Header */}
      <div className="bg-[rgb(38,94,166)] text-white p-6 rounded-t-lg text-center">
        <h1 className="text-xl font-bold">Complete Booking</h1>
      </div>

      {/* Content */}
      <div className="bg-white p-6 rounded-b-lg shadow-lg">
        {/* Booking Details */}
        <div className="space-y-4 mb-6">
          <div className="border-l-4 border-[rgb(38,94,166)] pl-4">
            <p className="font-semibold text-[rgb(38,94,166)]">Customer</p>
            <p className="text-gray-900">{booking?.name || 'N/A'}</p>
          </div>

          <div className="border-l-4 border-[rgb(38,94,166)] pl-4">
            <p className="font-semibold text-[rgb(38,94,166)]">From</p>
            <p className="text-gray-900 text-sm">
              {booking?.convertedPickup || booking?.pickupLocation || 'N/A'}
            </p>
          </div>

          <div className="border-l-4 border-[rgb(38,94,166)] pl-4">
            <p className="font-semibold text-[rgb(38,94,166)]">To</p>
            <p className="text-gray-900 text-sm">
              {booking?.convertedDropOff || booking?.dropoffLocation || 'N/A'}
            </p>
          </div>

          <div className="border-l-4 border-[rgb(38,94,166)] pl-4">
            <p className="font-semibold text-[rgb(38,94,166)]">Status</p>
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
              {booking?.status || 'Unknown'}
            </span>
          </div>
          <div className="border-l-4 border-[#265EA6] pl-4">
            <p className="font-semibold text-[#265EA6]">Fare</p>
            <span className="text-gray-900 text-lg">
              £{booking?.VehicleTypes[0]?.perVehiclePrice || 'N/A'}
            </span>
          </div>
        </div>

        {/* Form */}
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <div className="mb-6">
            <label className="flex items-center gap-2 mb-3 font-semibold text-[rgb(38,94,166)]">
              <span className="bg-[rgb(38,94,166)] text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">
                £
              </span>
              Amount Charged *
            </label>

            <Form.Item
              name="chargedAmount"
              rules={[
                { required: true, message: 'Please enter the amount' },
                { type: 'number', min: 0.01, message: 'Amount must be greater than 0' },
                {
                  validator: (_, value) => {
                    if (!value) return Promise.resolve();
                    if (
                      value > Number(booking?.VehicleTypes[0]?.perVehiclePrice) &&
                      !booking?.isPaymentOnline
                    ) {
                      return Promise.reject(
                        new Error(
                          `Amount cannot exceed fare (£${booking?.VehicleTypes[0]?.perVehiclePrice})`
                        )
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
              className="mb-0"
            >
              <InputNumber
                className="w-full h-12 text-lg"
                placeholder="0.00"
                disabled={booking?.isPaymentOnline}
                prefix="£"
                size="large"
              />
            </Form.Item>
          </div>

          <button
            type="submit"
            disabled={mutateIsLoading}
            className="w-full bg-[rgb(38,94,166)] hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
          >
            {mutateIsLoading ? 'Completing...' : 'Complete Booking'}
          </button>
        </Form>
      </div>
    </div>
  );
};

export default DriverCompletionForm;
