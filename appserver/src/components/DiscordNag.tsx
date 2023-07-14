import { Link, PagePad } from '@/components/uiLib'
import { useStore } from '@/lib/store'
import { trackingEvents } from '@/lib/trackingEvents'
import feedbackIcon from '@/assets/img/feedback.svg'
import Image from 'next/image'

const DiscordNag = () => {
  const store = useStore()
  if (!store.user) return <></>
  return (
    <div className={`py-4 border-b-[1px] border-edges-light`}>
      <PagePad wide noPadY>
        <div className="grid grid-cols-[auto_1fr] gap-2 items-center">
          <Image
            className="inline w-8 h-8"
            src={feedbackIcon}
            alt="feedback speech bubble"
          />
          <div className="text-sm">
            Thanks for being an alpha tester! Join our private{' '}
            <span className="whitespace-nowrap">
              <Link
                external
                href="https://discord.gg/Z9f8UjdfJx"
                trackEvent={trackingEvents.bcDiscordNag}
              >
                <strong>Discord server</strong>
              </Link>
            </span>{' '}
            to let us know what you think, we want to hear from you!
          </div>
        </div>
      </PagePad>
    </div>
  )
}

export default DiscordNag
