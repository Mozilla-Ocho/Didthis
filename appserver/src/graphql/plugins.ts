import { Plugin } from 'graphql-yoga'
import { GraphQLContext } from './context'

// Disable some eslint rules to support graphql-yoga generics
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types */

export enum AuthRole {
  Admin = 'Admin',
  User = 'User',
  DiscordBot = 'DiscordBot',
  Exporter = 'Exporter',
}

const TOKEN_ROLES = [
  [process.env.DISCORD_BOT_GRAPHQL_ACCESS_TOKEN, AuthRole.DiscordBot],
  [process.env.EXPORTER_GRAPHQL_ACCESS_TOKEN, AuthRole.Exporter],
] as const

export interface PluginAuthContext {
  authUser?: ApiUser
  authRole?: AuthRole
}

export function pluginAuth<
  PluginContext extends Record<string, any> = {},
  TServerContext extends PluginAuthContext & Record<string, any> = {},
  TUserContext = {}
>(): Plugin<PluginContext, TServerContext, TUserContext> {
  return {
    onRequest({ request, serverContext, fetchAPI, endResponse }) {
      const authorization = request.headers.get('authorization')
      if (authorization) {
        for (const [token, role] of TOKEN_ROLES) {
          if (token) {
            if (authorization === `Bearer ${token}`) {
              if (serverContext) {
                serverContext.authRole = role
              }
              return
            }
          }
        }

        // TODO: implement a more general access token check for users
      }

      // Authentication failed, so end the response with a 401 Forbidden
      endResponse(
        new fetchAPI.Response(null, {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        })
      )
    },
  }
}

export function createPlugins() {
  return [pluginAuth<GraphQLContext>()]
}
