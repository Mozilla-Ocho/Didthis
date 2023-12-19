import { Events } from "discord.js"
import type { EventHandler } from "../index"

const handler: EventHandler<Events.InteractionCreate> = {
  type: Events.InteractionCreate,
  async execute(context, interaction) {
    const { log, commands } = context;

    if (!interaction.isChatInputCommand()) return

    const command = commands.get(interaction.commandName)

    if (!command) {
      log.error(`No command matching ${interaction.commandName} was found.`)
      return
    }

    try {
      await command.execute(context, interaction)
    } catch (error) {
      log.error(error)
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: 'There was an error while executing this command!',
          ephemeral: true,
        })
      } else {
        await interaction.reply({
          content: 'There was an error while executing this command!',
          ephemeral: true,
        })
      }
    }

  }
}

export default handler;