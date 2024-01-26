import { trackingEvents } from '@/lib/trackingEvents'
import { observer } from 'mobx-react-lite'
import { Link } from './uiLib'
import Image from 'next/image'
import discordLogo from '@/assets/img/discord-logo.svg'

const DiscordCard = observer(() => {
  return (
    <div className="mt-12 border border-[#999] border-edges rounded-md overflow-hidden w-full basis-full sm:w-[373px] sm:basis-[373px]">
      <div className="p-6">
        <h5 className="mt-4 mb-2">
          <Link
            external
            href="https://discord.gg/Z9f8UjdfJx"
            trackEvent={trackingEvents.bcDiscordNag}
          >
            <Image
              className="inline mr-2"
              src={discordLogo}
              alt="discord logo"
            />
            Join our Discord
          </Link>
        </h5>

        <p className="break-words my-2 whitespace-pre-line min-h-[44px] text-sm mb-4">
          <span className="text-form-labels">
            Come see other projects from the community and share yours on our{' '}
            <Link
              external
              href="https://discord.gg/Z9f8UjdfJx"
              trackEvent={trackingEvents.bcDiscordNag}
            >
              Discord server
            </Link>
          </span>
        </p>
      </div>
    </div>
  )
})

export default DiscordCard
