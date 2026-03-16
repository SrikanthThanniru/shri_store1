/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV !== 'production'

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  // Local-network origins you use during development; not used in production
  allowedDevOrigins: ['192.168.1.2', '192.168.1.3'],
  async rewrites() {
    // In development, proxy /api to your local backend.
    // In production, the frontend will call https://storeapis.shriaaum.com directly
    // via NEXT_PUBLIC_API_URL (see lib/api.ts).
    if (isDev) {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:5000/api/:path*',
        },
      ]
    }

    return []
  },
}

export default nextConfig
