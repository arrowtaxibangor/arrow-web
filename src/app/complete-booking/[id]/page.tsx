// import BookingForm from "@/components/Booking/BookingForm";
import DriverCompletionForm from '@/components/Booking/CompleteBooking/CompleteBooking';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Arrow Taxi Bangor—Gwynedd, Snowdonia, Caernarfon, Seaport, Airport Taxi Service',
  description:
    'Call us on 01248209393 to book your taxi. We are based in Bangor, Gwynedd and operate 24/7. Snowdon, Tryfan, Beddgelert, Pwllheli, Caernarfon, Anglesey. To and from all major airports',
};

export default function Home() {
  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div>
        <DriverCompletionForm />
      </div>
    </div>
  );
}
