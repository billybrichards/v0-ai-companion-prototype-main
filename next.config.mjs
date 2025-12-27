/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: [
    'http://localhost:5000',
    'http://127.0.0.1:5000',
    '*.replit.dev',
    '*.kirk.replit.dev',
  ],
}

export default nextConfig