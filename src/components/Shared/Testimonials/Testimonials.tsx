import { PlaceReview } from '@/lib/googlePlaces';

type TestimonialsProps = {
  reviews: PlaceReview[];
  gbpUrl: string | null;
};

function StarRating({ rating }: { rating: number }): JSX.Element {
  const filled = Math.round(rating);
  return (
    <div className="flex gap-0.5" aria-label={`${filled} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={i < filled ? '#FEC601' : 'none'}
          stroke={i < filled ? '#FEC601' : '#d1d5db'}
          strokeWidth="1.5"
          className="h-4 w-4 shrink-0"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
          />
        </svg>
      ))}
    </div>
  );
}

export function Testimonials({ reviews, gbpUrl }: TestimonialsProps): JSX.Element | null {
  if (reviews.length === 0) return null;

  return (
    <section className="py-14 mobile:py-10">
      <div className="text-center mb-10 mobile:mb-7">
        <h2 className="text-3xl mobile:text-2xl font-bold text-gray-900">What our customers say</h2>
        <p className="mt-2 text-sm text-gray-500">From Google Reviews</p>
      </div>

      <div className="grid grid-cols-3 desktop:grid-cols-3 tabletlg:grid-cols-2 tablet:grid-cols-2 mobile:grid-cols-1 gap-5">
        {reviews.map((review, index) => (
          <article
            key={review.time + '-' + index}
            className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="font-semibold text-gray-900 text-sm leading-snug">
                {review.authorName}
              </span>
              <StarRating rating={review.rating} />
            </div>

            <p className="text-xs text-gray-400">{review.relativeTime}</p>

            <p className="text-sm text-gray-700 leading-relaxed overflow-hidden line-clamp-4">
              {review.text}
            </p>
          </article>
        ))}
      </div>

      {gbpUrl !== null && (
        <div className="mt-8 text-center">
          <a
            href={gbpUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-full border-2 border-primary_color px-6 py-2.5 text-sm font-semibold text-primary_color transition-colors hover:bg-primary_color hover:text-white"
          >
            See all reviews on Google
          </a>
        </div>
      )}
    </section>
  );
}
