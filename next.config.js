/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  async redirects() {
    return [
      // Redirect old villa pages to villa-styles section
      {
        source: '/villas/:slug*',
        destination: '/#villa-styles',
        permanent: true, // 301 redirect
      },
      // Redirect about-us to gallery section
      {
        source: '/about-us',
        destination: '/#gallery',
        permanent: true, // 301 redirect
      },
      // Redirect any other potential old URLs
      {
        source: '/villas',
        destination: '/#villa-styles',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
