import { CliContext } from './index'
import botStart from '../bot/index'

export default function init(context: CliContext) {
  const { program } = context
  program
    .command('start')
    .description('Start the bot')
    .action((...args) => command(context, ...args))
}

async function command(context: CliContext, ...args: any[]) {
  botStart(context)
}
