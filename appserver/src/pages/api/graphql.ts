import { createYoga } from 'graphql-yoga'
import { schema, createPlugins, createContext } from '../../graphql/index'
import { NextApiRequest, NextApiResponse } from 'next'

export const config = {
  api: {
    // Disable body parsing (required for file uploads)
    bodyParser: false,
  },
}

export default createYoga<{
  req: NextApiRequest
  res: NextApiResponse
}>({
  graphqlEndpoint: '/api/graphql',
  context: createContext,
  plugins: createPlugins(),
  schema,
})
