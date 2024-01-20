import { Link, PagePad } from '@/components/uiLib'
import { useStore } from '@/lib/store'
import { trackingEvents } from '@/lib/trackingEvents'
import giftcardIcon from '@/assets/img/giftcard.svg'
import Image from 'next/image'
import branding from '@/lib/branding'

const DiscordNag = () => {
  // removing for now as we are pushing discord in the projects list
  return <></>
  /*
  const store = useStore()
  if (!store.user) return <></>
  // hide discord nag for usertesting users
  if (store.user.signupCodeName === 'usertesting') return <></>
  return (
    <PagePad wide noPadY>
      <div className={`py-4 px-6 mt-4 bg-discordnag`}>
        <div className="grid grid-cols-[auto_1fr] gap-2 items-start">
          <div className="text-md">
            See what other folks are doing with {branding.productName} on our{' '}
            <span className="whitespace-nowrap">
              <Link
                external
                href="https://discord.gg/Z9f8UjdfJx"
                trackEvent={trackingEvents.bcDiscordNag}
              >
                <strong>private Discord server</strong>
              </Link>
            </span> or to chat directly with the product team and other fellow hobbyists!
          </div>
        </div>
      </div>
    </PagePad>
  )
  */
}

export default DiscordNag
