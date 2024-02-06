import * as fs from 'fs/promises'
import { Command } from 'commander'
import getConfig, { Config } from '../config'

import setupLogger, { Logger } from '../logging'

import initStart from './start'
import initDeploySlashCommands from './deploySlashCommands'

const commandModules = [initStart, initDeploySlashCommands] as const

export default async function cli(argv = process.argv) {
  const program = new Command(process.env.npm_package_version)
  const version = process.env.npm_package_version
  if (version) {
    program.version(version)
  }

  const config = await getConfig()

  const logRef = setupLogger({ config, program })

  const context: CliContext = {
    program,
    config,
    get log() {
      return logRef.current!
    },
  }

  for (const commandModule of commandModules) {
    commandModule(context)
  }

  return program.parseAsync(argv)
}

export type CliContext = {
  program: Command
  config: Config
  log: Logger
}
