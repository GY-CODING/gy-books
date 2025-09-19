/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: '/Users/gfigueras/projects/gycoding/gy-books',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      'api.gycoding.com',
      'localhost',
      'lh3.googleusercontent.com',
      'assets.hardcover.app',
      'raw.githubusercontent.com',
    ],
  },
};

export default nextConfig;
