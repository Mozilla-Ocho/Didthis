import { CliContext } from './index'
import { deployCommands } from '../bot/slashCommands/index'

export default function init(context: CliContext) {
  const { program } = context
  program
    .command('deploy-slash-commands')
    .description('Deploy slash-commands to Discord')
    .action((...args) => command(context, ...args))
}

async function command(context: CliContext, ...args: any[]) {
  deployCommands(context);
}
