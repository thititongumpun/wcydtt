/** @type {import('next').NextConfig} */

module.exports = {
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
  experimental: {
    nextScriptWorkers: true
  }
};
