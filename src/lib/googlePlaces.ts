type GoogleReview = {
  author_name: string;
  profile_photo_url: string | null;
  rating: number;
  text: string;
  relative_time_description: string;
  time: number;
  language: string | null;
};

type GoogleApiResponse = {
  status: string;
  result?: {
    rating?: number;
    user_ratings_total?: number;
    reviews?: GoogleReview[];
    url?: string;
  };
};

export type PlaceReview = {
  authorName: string;
  authorPhotoUrl: string | null;
  rating: number; // 1-5
  text: string;
  relativeTime: string; // e.g. "a week ago"
  time: number; // unix seconds, Google's `time` field
  language: string | null;
};

export type PlaceDetails = {
  rating: number; // e.g. 4.8
  totalReviews: number; // user_ratings_total
  reviews: PlaceReview[]; // up to 5
  url: string | null; // Google Business Profile URL (result.url)
};

export async function fetchPlaceDetails(): Promise<PlaceDetails | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey && !placeId) {
    console.warn(
      'fetchPlaceDetails: GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID environment variables are missing.'
    );
    return null;
  }
  if (!apiKey) {
    console.warn('fetchPlaceDetails: GOOGLE_PLACES_API_KEY environment variable is missing.');
    return null;
  }
  if (!placeId) {
    console.warn('fetchPlaceDetails: GOOGLE_PLACE_ID environment variable is missing.');
    return null;
  }

  // reviews_sort=newest: return latest reviews, not Google's "most relevant" algorithmic ordering
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=rating,user_ratings_total,reviews,url&reviews_sort=newest&key=${apiKey}`;

  let data: GoogleApiResponse;
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) {
      console.error(
        `fetchPlaceDetails: HTTP error from Google Places API — status ${res.status} ${res.statusText}`
      );
      return null;
    }
    data = (await res.json()) as GoogleApiResponse;
  } catch (err) {
    console.error('fetchPlaceDetails: Failed to fetch from Google Places API.', err);
    return null;
  }

  if (data.status !== 'OK') {
    console.error(
      `fetchPlaceDetails: Google Places API returned a non-OK status — "${data.status}"`
    );
    return null;
  }

  const result = data.result;

  if (result?.rating === undefined || result?.rating === null) {
    console.error('fetchPlaceDetails: Google Places API response is missing the `rating` field.');
    return null;
  }
  if (result?.user_ratings_total === undefined || result?.user_ratings_total === null) {
    console.error(
      'fetchPlaceDetails: Google Places API response is missing the `user_ratings_total` field.'
    );
    return null;
  }

  const rawReviews: GoogleReview[] = result.reviews ?? [];

  const reviews: PlaceReview[] = rawReviews
    .slice()
    .sort((a, b) => b.time - a.time)
    .slice(0, 5)
    .map((r) => ({
      authorName: r.author_name,
      authorPhotoUrl: r.profile_photo_url ?? null,
      rating: r.rating,
      text: r.text,
      relativeTime: r.relative_time_description,
      time: r.time,
      language: r.language ?? null,
    }));

  return {
    rating: result.rating,
    totalReviews: result.user_ratings_total,
    reviews,
    url: result.url ?? null,
  };
}
