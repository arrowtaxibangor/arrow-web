import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/admin',
        '/api/',
        '/api',
        '/complete-booking',
        '/bookings',
        '/thank-you',
      ],
    },
    sitemap: 'https://www.arrow.taxi/sitemap.xml',
    host: 'https://www.arrow.taxi',
  };
}
