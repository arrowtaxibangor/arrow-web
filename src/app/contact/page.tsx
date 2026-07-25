import ContactForm from '@/components/Contact/ContactForm/ContactForm';
import ContactInfo from '@/components/Contact/ContactInfo/ContactInfo';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Bangor Taxi - Reliable Gwynedd Taxi Service',
  description:
    'Call us on 01248209393 to book your taxi. We are based in Bangor, Gwynedd and operate 24/7. Snowdon, Tryfan, Beddgelert, Pwllheli, Caernarfon, Anglesey. To and from all major airports',
};

export default function Contact() {
  return (
    <div className="w-full max-w-[1170px] mx-auto pt-[87px] pb-7">
      <div className="grid grid-cols-2 tabletlg:grid-cols-1 tabletlg:gap-4 gap-0 h-full">
        <ContactForm />
        <ContactInfo />
      </div>
    </div>
  );
}
