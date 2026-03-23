/** @type {import('next').NextConfig} */
const nextConfig = {
  // === PERBAIKAN DEV INDICATORS ===
  devIndicators: {
    appIsrStatus: true,
    buildActivity: true,
    buildActivityPosition: 'top-left', // Pastikan tulisannya benar
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;