import { typeDefs as scalarTypeDefs } from 'graphql-scalars'
import { loadFilesSync } from "@graphql-tools/load-files"

export const typeDefs = [
  ...scalarTypeDefs,
  loadFilesSync("**/*.graphql")
]
