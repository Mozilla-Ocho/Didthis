import { trackingEvents } from '@/lib/trackingEvents'
import { observer } from 'mobx-react-lite'
import { Link } from './uiLib'

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
            Join our Discord community
          </Link>
        </h5>

        <p className="break-words my-2 whitespace-pre-line min-h-[44px] text-sm mb-4">
          <span className="text-form-labels">
            Check out what other folks are up to and share your projects on our{' '}
            <Link
              external
              href="https://discord.gg/Z9f8UjdfJx"
              trackEvent={trackingEvents.bcDiscordNag}
            >
              private Discord server
            </Link>
            . It’s also a great place to ask questions, request features, and
            share feedback directly with the Didthis team. We’d love to hear
            from you!
          </span>
        </p>
      </div>
    </div>
  )
})

export default DiscordCard
