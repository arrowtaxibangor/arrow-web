/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';
import React from 'react';
import { Button, Input, Form, message, Spin } from 'antd';
import { useMutation } from 'react-query';
import { sendContactMessage } from '../../../../services/contact';

const { TextArea } = Input;

export default function ContactForm() {
  const [form] = Form.useForm();

  const { mutate, isLoading } = useMutation(sendContactMessage, {
    onSuccess: (res: any) => {
      message.success(res?.message || 'Message sent successfully!');
      form.resetFields();
    },
    onError: (err: any) => {
      message.error(err?.response?.data?.message || 'Failed to send message');
    },
  });

  const onFinish = (values: any) => {
    mutate(values);
  };

  return (
    <div className="bg-[#F7F7F8] mobilelg:p-[35px] p-[65px] tabletlg:rounded-[30px] rounded-l-[30px] rounded-r-[0] gap-[19px] h-full flex flex-col justify-center">
      <div className="w-full flex flex-col gap-[10px]">
        <h1 className="text-[35px] font-[700] text-[#333C33] leading-[90%]">Contact us</h1>
        <p className="text-[16px] leading-[25px] text-[#000] font-[300]">
          Welcome to Discuss your plans with the driver and they can then give you our best quote.
        </p>
      </div>
      <Spin spinning={isLoading} size="large">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="space-y-4 contactForm"
          disabled={isLoading}
        >
          <Form.Item
            name="name"
            label={
              <label className="text-[12px] font-[600] text-[#666] leading-[18px]">Name</label>
            }
            rules={[{ required: true }]}
          >
            <Input
              className="h-[56px] !rounded-[8px] !p-[16px] !border-[1px] !border-[#CCCCCC] placeholder:text-[#666666] placeholder:text-[16px]"
              placeholder="Enter Your Name"
            />
          </Form.Item>

          <Form.Item
            name="email"
            label={
              <label className="text-[12px] font-[600] text-[#666] leading-[18px]">Email</label>
            }
            rules={[{ type: 'email', required: true }]}
          >
            <Input
              className="h-[56px] !rounded-[8px] !p-[16px] !border-[1px] !border-[#CCCCCC] placeholder:text-[#666666] placeholder:text-[16px]"
              placeholder="Enter Your Email"
            />
          </Form.Item>

          <Form.Item
            name="phone"
            label={
              <label className="text-[12px] font-[600] text-[#666] leading-[18px]">Phone</label>
            }
            rules={[{ required: true }]}
          >
            <Input
              className="h-[56px] !rounded-[8px] !p-[16px] !border-[1px] !border-[#CCCCCC] placeholder:text-[#666666] placeholder:text-[16px]"
              placeholder="Enter Your Phone Number"
            />
          </Form.Item>

          <Form.Item name="message" rules={[{ required: true }]}>
            <TextArea
              className="rounded-[8px] !border-[1px] !p-[16px] !border-[#CCCCCC] placeholder:text-[#666666] placeholder:text-[16px]"
              rows={5}
              placeholder="Write your message here..."
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              className="bg-primary_color border-none text-white w-[109px] h-[37px] rounded-[8px] text-[20px] font-[500] leading-[20px]"
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </div>
  );
}
