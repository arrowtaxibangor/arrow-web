import { BookingButton } from '@/components/Shared/BookingButton/BookingButton';

export function BookRideMiniCard() {
  return (
    <div
      className="rounded-2xl p-6"
      style={{ background: 'linear-gradient(135deg, #0f2040 0%, #265EA6 100%)' }}
    >
      <h3 className="text-white font-bold text-[16px] leading-[1.3] mb-2">
        Need a taxi in North Wales?
      </h3>
      <p className="text-white/60 text-[13px] leading-[1.55] mb-4">
        Arrow Taxi covers Bangor, Snowdonia, and airport transfers across the region. Get an instant
        quote.
      </p>
      <BookingButton label="Book a ride" href="/" className="w-full sm:w-full text-[14px]" />
    </div>
  );
}
