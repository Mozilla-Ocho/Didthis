/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      // DRY_86188 legal page routes
      { source: '/terms', destination: '/legal/terms' },
      { source: '/privacy', destination: '/legal/privacy' },
      { source: '/content', destination: '/legal/content' },
    ]
  },
}

module.exports = nextConfig
