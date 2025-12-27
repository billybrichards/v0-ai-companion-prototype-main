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
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'https://2-terminal-companion--billy130.replit.app',
  },
}

export default nextConfig