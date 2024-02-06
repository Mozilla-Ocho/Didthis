import Pino from 'pino'
import { Config } from '../config'
import { Client, Collection, ClientEvents, GatewayIntentBits } from 'discord.js'

import { assembleCommands, SlashCommand } from './slashCommands/index'

import handlerReady from './events/ready'
import handlerInteractionCreate from './events/interactionCreate'
import { Logger } from '../logging'
import initDidthisClient, { DidthisClient } from '../didthis-client/index'

const handlers = [handlerReady, handlerInteractionCreate] as const

export default async function start(context: BotContext) {
  const { config, log } = context

  const botToken = config.get('botToken')
  if (!botToken) {
    log.error("Discord bot token not configured")
    process.exit(1)
  }

  const didthisClient = await initDidthisClient({ config, log })
  const discordClient = new Client({ intents: [GatewayIntentBits.Guilds] })
  const commands = await assembleCommands()

  await registerEventHandlers({
    ...context,
    commands,
    didthisClient,
    discordClient,
  })
  await discordClient.login(botToken)
}

async function registerEventHandlers(eventContext: EventContext) {
  const { discordClient } = eventContext
  for (const { once, type, execute } of handlers) {
    discordClient[once ? 'once' : 'on'](type, (...args) =>
      // @ts-ignore cannot specify ...args type dynamically based on handler in loop, but it should match up
      execute(eventContext, ...args)
    )
  }
}

export type BotContext = {
  config: Config
  log: Logger
}

export type EventContext = BotContext & {
  commands: Collection<string, SlashCommand>
  didthisClient: DidthisClient
  discordClient: Client<boolean>
}

export interface EventHandler<T extends keyof ClientEvents> {
  type: T
  once?: boolean
  execute: (context: EventContext, ...args: ClientEvents[T]) => Promise<void>
}
