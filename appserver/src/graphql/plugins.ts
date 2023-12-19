import { Plugin } from 'graphql-yoga'

export function pluginAuth(): Plugin {
  return {
    onRequest({ request, fetchAPI, endResponse }) {
      const authorization = request.headers.get('authorization')
      if (authorization) {
        // Check for special case Discord bot secret
        const accessTokenDiscordBot = process.env.DISCORD_BOT_GRAPHQL_ACCESS_TOKEN;
        if (accessTokenDiscordBot) {
          const expectedAuthorization = `Bearer ${accessTokenDiscordBot}`;
          if (authorization === expectedAuthorization) {
            return;
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

export const plugins = [pluginAuth()]
