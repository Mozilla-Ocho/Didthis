import {
  CacheType,
  ChatInputCommandInteraction,
  Collection,
  REST,
  Routes,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from 'discord.js'

import { Config } from '../../config'
import { Logger } from '../..//logging'

import { EventContext } from '../index'

import commandPing from './ping'

export const commandModules = [commandPing] as const

export type SlashCommand = {
  data:
    | SlashCommandBuilder
    | SlashCommandSubcommandsOnlyBuilder
    | SlashCommandOptionsOnlyBuilder
  execute: (
    context: EventContext,
    interaction: ChatInputCommandInteraction<CacheType>
  ) => Promise<void>
}

export async function assembleCommands() {
  const commands = new Collection<string, SlashCommand>()
  for (const commandModule of commandModules) {
    commands.set(commandModule.data.name, commandModule)
  }
  return commands
}

export async function deployCommands({
  config,
  log,
}: {
  config: Config
  log: Logger
}) {
  const commands = await assembleCommands()
  const rest = new REST().setToken(config.get('botToken'))

  const routeApplicationGuildCommands = Routes.applicationGuildCommands(
    config.get('clientId'),
    config.get('guildId')
  )

  const routeApplicationCommands = Routes.applicationCommands(
    config.get('clientId')
  )

  try {
    log.info('Deleting deployed commands')
    const deleteResult = await Promise.all([
      rest.put(routeApplicationGuildCommands, { body: [] }),
      rest.put(routeApplicationCommands, { body: [] }),
    ])
    log.debug('Deletion succeeded')
    log.trace({ msg: 'Deletion result', deleteResult })

    // Grab the metadata for all commands
    log.info('Deploying fresh commands')
    const body = commands.map(command => command.data.toJSON())
    const deployResult = await rest.put(
      false ? routeApplicationGuildCommands : routeApplicationCommands,
      { body }
    )
    log.trace({ msg: 'Deploy result ', deployResult })
    log.info({ msg: 'Successfully deployed slash commands' })
  } catch (error) {
    log.error({ msg: 'Deployment failed', error })
    process.exit(1)
  }
}
