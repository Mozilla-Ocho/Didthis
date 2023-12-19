import { Client, Events } from "discord.js"
import type { EventHandler } from "../index"
import { start as startPublicUpdatesWatcher } from '../publicUpdatesWatcher'

const handler: EventHandler<Events.ClientReady> = {
  type: Events.ClientReady,
  once: true,
  async execute(context, client) {
    const { log } = context;
    log.info(`Ready! Logged in as ${client.user.tag}`)

    await startPublicUpdatesWatcher(context)
  }
}

export default handler;