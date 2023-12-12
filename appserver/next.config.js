const { version } = require('./package.json')

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
  publicRuntimeConfig: {
    version,
    build: Date.now(),
    tag: process.env.IMAGE_TAG,
  },
}

module.exports = nextConfig
