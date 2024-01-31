import { CodegenConfig } from '@graphql-codegen/cli'

import * as dotenv from 'dotenv'
dotenv.config()

const API_URL =
  process.env.DISCORD_BOT_DIDTHIS_API_URL || 'http://localhost:3000/api/graphql'
const ACCESS_TOKEN = process.env.DISCORD_BOT_GRAPHQL_ACCESS_TOKEN
const GQL_PATH = './src/didthis-client/gql/'

const config: CodegenConfig = {
  // schema: 'https://didthis.app/api/graphql',
  schema: [
    {
      [API_URL]: {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      },
    },
  ],
  documents: ['./src/**/*.ts', `${GQL_PATH}/**/*`],
  emitLegacyCommonJSImports: true,
  generates: {
    [GQL_PATH]: {
      preset: 'client',
    },
  },
}

export default config
