import nextJest from 'next/jest.js'

async function configBuilder() {
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  const createJestConfig = nextJest({ dir: './' })

  const baseConfig = await createJestConfig({
    testEnvironment: 'jest-environment-jsdom',
  })()

  return {
    ...baseConfig,

    // entirely override the ignore patterns from next to allow some problematic modules
    transformIgnorePatterns: [
      '/node_modules/(?!(jose|jwks-rsa|normalize-url)/)',
    ],
  }
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default configBuilder
