import { SlashCommandBuilder } from 'discord.js'
import type { SlashCommand } from '.'

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),
  async execute({ config, log, discordClient: client }, interaction) {
    await interaction.reply('Pong!')
  },
}

export default command
