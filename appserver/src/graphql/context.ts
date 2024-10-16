import { YogaInitialContext } from 'graphql-yoga'
import { NextApiRequest, NextApiResponse } from 'next'
import { PluginAuthContext } from './plugins'

export type GraphQLContext = YogaInitialContext & PluginAuthContext & {
  req: NextApiRequest
  res: NextApiResponse
  baseUrl: URL
  parentUser?: ApiUser
}

export async function createContext(
  initialContext: YogaInitialContext & {
    req: NextApiRequest
    res: NextApiResponse
  }
): Promise<GraphQLContext> {
  const { req, res } = initialContext
  return {
    ...initialContext,
    baseUrl: getBaseUrlFromRequest(req)
  }
}

function getBaseUrlFromRequest(req: NextApiRequest) {
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
  const host = req.headers.host
  return new URL(`${protocol}://${host}`)
}
