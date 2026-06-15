/** @type {import('next').NextConfig} */
// Next.js configuration for the AW Barbershop frontend.
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Allow remote barber/service photos from Unsplash (sample data).
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

module.exports = nextConfig;
