import { createSchema, Plugin } from 'graphql-yoga'
import { typeDefs } from './typeDefs'
import { resolvers, CustomContext } from './resolvers'

export { plugins } from './plugins'

export const schema = createSchema<CustomContext>({
  typeDefs,
  resolvers,
})
