/** @type {import('next').NextConfig} */
const nextConfig = {
  // App Router is now stable in Next.js 15, no experimental flag needed
  outputFileTracingRoot: __dirname,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async rewrites() {
    return {
      fallback: [
        {
          source: '/uploads/:path*',
          destination: 'http://localhost:3003/uploads/:path*',
        },
      ],
    }
  },
}

module.exports = nextConfig
