import {
  Client,
  MessageCreateOptions,
  TextBasedChannel,
  blockQuote,
  hyperlink,
  quote,
  userMention,
} from 'discord.js'
import { BotContext } from '.'
import { DidthisClient } from '../didthis-client'
import { UpdateFragmentFragment } from '../didthis-client/gql/graphql'

export type PublicUpdatesWatcherContext = BotContext & {
  didthisClient: DidthisClient
  discordClient: Client<boolean>
}

let lastPublicUpdatesPoll: Date
let publicUpdatesPollTimer: ReturnType<typeof setTimeout>

export async function start(context: PublicUpdatesWatcherContext) {
  const { config, log } = context

  const postCatchup = config.get('publicUpdatesPostCatchup')
  lastPublicUpdatesPoll = new Date(Date.now() - postCatchup)

  log.info({ msg: 'Starting public updates watcher', lastPublicUpdatesPoll })
  await pollPublicUpdates(context)
}

export async function stop() {
  if (publicUpdatesPollTimer) {
    clearTimeout(publicUpdatesPollTimer)
  }
}

async function pollPublicUpdates(context: PublicUpdatesWatcherContext) {
  const { config, log, didthisClient, discordClient } = context

  // Ignore any updates newer than our delay, to allow an edit window
  const postDelay = config.get('publicUpdatesPostDelay')
  let untilUpdatedAt = new Date(Date.now() - postDelay)

  try {
    // Check to ensure we have a proper text-based channel configured
    const discordChannelId = config.get('channelId')
    const channel = await discordClient.channels.fetch(discordChannelId)
    if (channel && channel.isTextBased()) {
      // Fetch relevant updates since last poll for discord users
      const since = lastPublicUpdatesPoll.toISOString()
      const until = untilUpdatedAt.toISOString()
      log.debug({ msg: 'Polling for public updates', since, until })
      const updates = await didthisClient.fetchPublicUpdates({
        since,
        until,
        requireDiscordAccount: true,
        requireAutoShare: true,
      })

      // Share the updates, if we found any
      for (const update of updates) {
        // Skip any undefined updates - quirk in generated type
        if (!update) continue
        await postPublicUpdateToChannel(context, update, channel)
      }
    }
  } catch (error) {
    log.error({ msg: 'Public updates poll failed', error })
  }

  // Use the untilUpdatedAt limit as where we pick up again, next poll
  lastPublicUpdatesPoll = untilUpdatedAt

  const pollInterval = config.get('publicUpdatesPollPeriod')
  publicUpdatesPollTimer = setTimeout(
    async () => await pollPublicUpdates(context),
    pollInterval
  )
}

const ONE_DAY = 1000 * 60 * 60 * 24

const UPDATE_TYPE_LABELS = {
  text: 'a text update',
  image: 'an image update',
  link: 'a link update',
  other: 'an update',
} as const

async function postPublicUpdateToChannel(
  context: PublicUpdatesWatcherContext,
  update: UpdateFragmentFragment,
  channel: TextBasedChannel
) {
  const { log } = context

  const user = update.user
  const discordAccount = user.profile.connectedAccounts!.discord!

  // Link to the discord user for more relevant context in channel
  const userDisplay = userMention(discordAccount.id!)

  const updateTypeDisplay =
    UPDATE_TYPE_LABELS[update.type] || UPDATE_TYPE_LABELS.other

  // Include a didthis at date, if it's older than one day
  let didthisAtDisplay = ''
  if (update.didThisAt) {
    const didThisAtDate = new Date(update.didThisAt)
    const age = Date.now() - new Date(didThisAtDate).getTime()
    if (age > ONE_DAY) {
      didthisAtDisplay = ` from ${didThisAtDate.toLocaleString()}`
    }
  }

  const project = update.project
  const projectName = project.title || 'untitled project'
  const projectDisplay = hyperlink(projectName, update.url)

  let message: MessageCreateOptions = {
    // HACK: this allows us to include linked user mentions in the message without actually alerting the user
    // see also: https://discord.com/developers/docs/resources/channel#allowed-mentions-object-allowed-mentions-reference
    allowedMentions: {
      parse: [],
    },
  }

  let content = [
    `${userDisplay} posted ${updateTypeDisplay}${didthisAtDisplay} to ${projectDisplay}`,
  ]

  if ('link' === update.type && update.linkUrl) {
    const linkUrl = update.linkUrl
    const linkTitle = update.linkMeta?.title || linkUrl
    const linkDisplay = hyperlink(linkTitle, linkUrl)
    const linkHost = update.linkMeta?.host

    content.push(`- ${linkHost ? `${linkHost} — ` : ''}${linkDisplay}`)

    const linkMeta = update.linkMeta
    if (linkMeta?.imageUrl) {
      message.embeds = [
        {
          image: {
            url: linkMeta.imageUrl,
            width: linkMeta.imageMeta?.width,
            height: linkMeta.imageMeta?.height,
          },
        },
      ]
    }
  }

  if ('image' === update.type) {
    message.embeds = [
      {
        image: {
          url: update.imageSrc,
          width: update.imageMeta?.width,
          height: update.imageMeta?.height,
        },
      },
    ]
  }

  if (update.description) {
    content.push(blockQuote(update.description))
  }

  message.content = content.join('\n')

  log.info({ msg: 'Posted project update', url: update.url })

  return channel.send(message)
}
