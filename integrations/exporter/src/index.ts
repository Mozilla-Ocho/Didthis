import { Command } from 'commander'
import initCommandExport from './commands/export'
import initCloudinary from './lib/cloudinary'
import loadConfig from './lib/config'
import setupLogger from './lib/logging'
import { CliContext } from './lib/types'

export default async function cli(argv = process.argv) {
  const program = new Command(process.env.npm_package_version)
  const version = process.env.npm_package_version
  if (version) program.version(version)

  const config = await loadConfig()
  const log = await setupLogger({ config, program })

  const context: CliContext = { program, config, log }

  await initCloudinary(context)
  await initCommandExport(context)

  return program.parseAsync(argv)
}

cli().catch(error => {
  console.error(error)
  process.exit(1)
})
