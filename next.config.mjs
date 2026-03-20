/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**', // Mengizinkan semua folder di dalam Cloudinary Anda
      },
      // Anda bisa menambahkan hostname lain di sini jika nanti butuh, misalnya unsplash
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig; 
// Catatan: Jika file Anda bernama next.config.js, gunakan: module.exports = nextConfig;