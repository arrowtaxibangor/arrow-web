export const getGoogleRating = async () => {
  const res = await fetch('/api/google/rating');
  return res.json();
};

export const getGoogleReviews = async () => {
  const res = await fetch('/api/google/reviews');
  return res.json();
};
