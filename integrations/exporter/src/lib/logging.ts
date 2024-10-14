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

export default async function setupLogger(context: LoggingContext) {
  const { config } = context
  const level = config.get('logLevel')
  const usePrettyLogs = process.stdout.isTTY
  const logSingleLine = config.get('logSingleLine')
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
