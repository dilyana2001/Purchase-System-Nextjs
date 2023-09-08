/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: 'standalone',
  images: {
    domains: [
      'firebasestorage.googleapis.com',
      'localhost',
      'images.immediate.co.uk',
      'thumbs.dreamstime.com',
      'images.unsplash.com',
    ],   
  },
//   experimental: {
//     runtime: 'experimental-edge',
//   },
}

module.exports = nextConfig;
