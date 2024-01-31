import * as dotenv from 'dotenv'
import convict from 'convict'
import { configSchema as loggingConfigSchema } from './logging'

export async function loadConfig() {
  dotenv.config()
  const config = convict({
    ...loggingConfigSchema,
    clientId: {
      doc: 'Discord client ID',
      env: 'DISCORD_CLIENT_ID',
      format: String,
      default: '',
      nullable: false,
    },
    clientSecret: {
      doc: 'Discord client secret',
      env: 'DISCORD_CLIENT_SECRET',
      format: String,
      default: '',
      nullable: false,
      sensitive: true,
    },
    guildId: {
      doc: 'Discord server ID - https://support.discord.com/hc/en-us/articles/206346498',
      env: 'DISCORD_SERVER_ID',
      format: String,
      default: '',
    },
    channelId: {
      doc: 'Discord channel ID for announcements',
      env: 'DISCORD_CHANNEL_ID',
      format: String,
      default: '',
    },
    botToken: {
      doc: 'Discord bot token',
      env: 'DISCORD_BOT_TOKEN',
      format: String,
      default: '',
      nullable: false,
      sensitive: true,
    },
    discordBaseUrl: {
      doc: 'Discord base URL',
      env: 'DISCORD_BASE_URL',
      default: 'https://discord.com',
    },
    didthisApiUrl: {
      doc: 'Didthis GraphQL API URL',
      env: 'DISCORD_BOT_DIDTHIS_API_URL',
      default: 'https://didthis.app/api/graphql',
    },
    didthisApiToken: {
      doc: 'Didthis GraphQL access token',
      env: 'DISCORD_BOT_GRAPHQL_ACCESS_TOKEN',
      format: String,
      default: '',
      nullable: false,
      sensitive: true,
    },
    publicUpdatesPollPeriod: {
      doc: "Period (in ms) between polls for public updates",
      env: "DISCORD_BOT_PUBLIC_UPDATES_POLL_PERIOD",
      format: Number,
      default: 10 * 1000, // 10 seconds
    },
    publicUpdatesPostCatchup: {
      doc: "Period in history to look for new posts on startup, to account for things missed in deployment",
      env: "DISCORD_BOT_PUBLIC_UPDATES_POST_CATCHUP",
      format: Number,
      default: 5 * 60 * 1000, // 1 minute
    },
    publicUpdatesPostDelay: {
      doc: "Minimum age (in ms) for updates before posting to channel",
      env: "DISCORD_BOT_PUBLIC_UPDATES_POST_DELAY",
      format: Number,
      default: 45 * 1000, // 45 seconds minute
    },
  })
  config.validate()
  return config
}

export type Config = Awaited<ReturnType<typeof loadConfig>>

export const globalConfig = {
  current: undefined as undefined | Config,
}

export function resetConfig() {
  globalConfig.current = undefined
}

export default async function getConfig() {
  if (!globalConfig.current) {
    globalConfig.current = await loadConfig()
  }
  return globalConfig.current
}
