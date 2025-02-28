import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/auth/:path*',
        destination: 'http://localhost:4100/auth/:path*', // ✅ NestJS Auth API (포트 4000)
      },
      {
        source: '/api/user/:path*',
        destination: 'http://localhost:4100/user/:path*', // ✅ NestJS User API (포트 4000)
      },
      {
        source: '/api/:path*',
        destination: 'http://localhost:4001/:path*', // ✅ NestJS 일반 API (포트 4001)
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'live.staticflickr.com',
        port: '',
        pathname: '/**/*',
        search: '',
      },
    ],
  },
};

export default nextConfig;
