import { createYoga } from 'graphql-yoga'
import { schema, plugins } from '../../graphql/index'

export const config = {
  api: {
    // Disable body parsing (required for file uploads)
    bodyParser: false,
  },
}

export default createYoga({
  graphqlEndpoint: '/api/graphql',
  plugins,
  schema,
})
