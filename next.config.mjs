/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api-arrowtaxi.binarymarvels.com',
      },
    ],
  },
};

export default nextConfig;
