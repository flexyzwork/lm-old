/** @type {import('next').NextConfig}  */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/auth/:path*',
        destination: 'http://localhost:4000/auth/:path*', // ✅ NestJS Auth API (포트 4000)
      },
      {
        source: '/api/:path*',
        destination: 'http://localhost:8001/api/:path*',
      },
    ];
  },
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
