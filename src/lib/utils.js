export const getBaseUrl = () => {
  // Jika sudah di-deploy ke Vercel
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }
  // Jika masih di laptop sendiri
  return 'http://localhost:3000';
};