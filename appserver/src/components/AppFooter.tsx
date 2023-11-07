import { observer } from 'mobx-react-lite'
import { Divider, Link, PagePad } from './uiLib'
import pathBuilder from '@/lib/pathBuilder'
import discordLogo from '@/assets/img/discord-logo.svg'
import Image from 'next/image'
import { useStore } from '@/lib/store'
import { trackingEvents } from '@/lib/trackingEvents'
import useAppShell from '@/lib/appShellContent'

const AppFooter = observer(
  ({ unauthHomepage }: { unauthHomepage?: boolean }) => {
    const store = useStore()
    const appShell = useAppShell()

    // Hide this component when viewed in the native app shell.
    if (appShell.inAppWebView) return <></>

    const discordIcon = (
      <Image className="inline" src={discordLogo} alt="discord logo" />
    )
    const discordLink = (
      <p>
        <strong>Have feedback?</strong>{' '}
        <span className="whitespace-nowrap">
          {discordIcon}{' '}
          <Link
            external
            href="https://discord.gg/Z9f8UjdfJx"
            trackEvent={trackingEvents.bcDiscord}
          >
            Join our Discord server!
          </Link>
        </span>
      </p>
    )
    const tosLink = (
      <p className="whitespace-nowrap">
        <Link intent="internalNav" href={pathBuilder.legal('tos')}>
          Terms of service
        </Link>
      </p>
    )
    const ppLink = (
      <p className="whitespace-nowrap">
        <Link intent="internalNav" href={pathBuilder.legal('pp')}>
          Privacy notice
        </Link>
      </p>
    )
    const cpLink = (
      <p className="whitespace-nowrap">
        <Link intent="internalNav" href={pathBuilder.legal('cp')}>
          Content policies
        </Link>
      </p>
    )
    const bull = <p className="hidden md:block">&bull;</p>
    const ochoLink = (
      <p className="whitespace-nowrap">
        A{' '}
        <Link
          newTab
          href="https://future.mozilla.org"
          trackEvent={trackingEvents.bcOchoIdea}
        >
          Mozilla Ocho
        </Link>{' '}
        Idea
      </p>
    )

    if (store.user) {
      return (
        <div className="bg-white">
          <Divider className="my-0" />
          <PagePad wide={true} noPadY>
            <div className="py-6 flex flex-col md:flex-row gap-2 md:gap-6 md:justify-between text-sm md:items-center">
              {discordLink}
              <div className="flex flex-col md:flex-row gap-2 md:gap-3 lg:gap-6 md:justify-end text-sm">
                {tosLink}
                {ppLink}
                {cpLink}
                {bull}
                {ochoLink}
              </div>
            </div>
          </PagePad>
        </div>
      )
    } else {
      return (
        <div className="bg-white">
          <Divider className="my-0" />
          <PagePad wide={true} noPadY>
            <div className="py-6 flex flex-col md:flex-row gap-2 md:gap-8 md:justify-center text-sm">
              {tosLink}
              {ppLink}
              {cpLink}
              {bull}
              {ochoLink}
            </div>
          </PagePad>
        </div>
      )
    }
  }
)

export default AppFooter
