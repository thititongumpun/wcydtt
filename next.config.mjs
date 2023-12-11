import million from 'million/compiler';

/** @type {import('next').NextConfig} */

const nextConfig = {
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'imgix.cosmicjs.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
};

const millionConfig = {
  auto: true,
  // if you're using RSC:
  auto: { rsc: true },
};

export default million.next(nextConfig, millionConfig);
