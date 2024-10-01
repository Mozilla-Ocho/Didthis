import { createSchema, Plugin } from 'graphql-yoga'
import { typeDefs } from './typeDefs'
import { resolvers } from './resolvers'
import { GraphQLContext } from "./context"

export { createPlugins } from './plugins'

export { createContext } from './context'

export const schema = createSchema<GraphQLContext>({
  typeDefs,
  resolvers,
})
