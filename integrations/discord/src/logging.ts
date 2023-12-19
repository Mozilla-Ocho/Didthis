import { Command } from 'commander'
import { Config } from './config'
import Pino from 'pino'
import PinoPretty from 'pino-pretty'

export const configSchema = {
  logLevel: {
    doc: 'Logging level',
    env: 'LOG_LEVEL',
    format: ['trace', 'debug', 'info', 'warn', 'error'],
    default: 'info',
  },
  logSingleLine: {
    doc: 'Emit single-line log messages',
    env: 'LOG_SINGLE_LINE',
    format: Boolean,
    default: true,
  },
}

export type LoggingContext = {
  program: Command
  config: Config
}

export default function setupForCli(context: LoggingContext) {
  const { config, program } = context

  const logRef: LoggerRef = { current: undefined }

  program.option(
    '--expand-logs',
    'expand log messages rather than compressing to single line'
  )
  program.option('--no-expand-logs', 'compress log messages to single line')
  program.option('-C, --force-pretty-logs', 'enable pretty printing of logs')
  program.option('--no-pretty-logs', 'disable pretty printing of logs in a TTY')

  program.hook('preAction', thisCommand => {
    logRef.current = buildForCli({ program: thisCommand, config })
  })

  return logRef
}

function buildForCli({ program, config }: LoggingContext) {
  const { prettyLogs, forcePrettyLogs, expandLogs, noExpandLogs } =
    program.opts()

  const level = config.get('logLevel')

  const usePrettyLogs = forcePrettyLogs || (process.stdout.isTTY && prettyLogs)

  let logSingleLine: boolean
  if (expandLogs) {
    logSingleLine = false
  } else if (noExpandLogs) {
    logSingleLine = true
  } else {
    logSingleLine = config.get('logSingleLine')
  }

  return build(level, logSingleLine, usePrettyLogs)
}

function build(level: string, singleLine: boolean, usePrettyLogs: boolean) {
  // const levelVal = Pino.levels.values[level]
  return Pino(
    { level },
    usePrettyLogs ? PinoPretty({ colorize: true, singleLine }) : process.stdout
  )
}

export type Logger = Awaited<ReturnType<typeof build>>

export type LoggerRef = { current: Logger | undefined }
