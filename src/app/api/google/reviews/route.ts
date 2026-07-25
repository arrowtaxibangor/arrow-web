import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    return NextResponse.json({ error: 'Missing configuration' }, { status: 500 });
  }

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews&key=${apiKey}`;

  const res = await fetch(url, { next: { revalidate: 3600 } });
  const data = await res.json();

  if (data.status !== 'OK') {
    return NextResponse.json({ error: data.status }, { status: 502 });
  }

  type GoogleReview = {
    author_name: string;
    profile_photo_url: string;
    rating: number;
    text: string;
    relative_time_description: string;
  };

  const reviews = (data.result.reviews ?? []).map((r: GoogleReview) => ({
    name: r.author_name,
    profilePhoto: r.profile_photo_url,
    rating: r.rating,
    message: r.text,
    date: r.relative_time_description,
  }));

  return NextResponse.json({ reviews });
}
