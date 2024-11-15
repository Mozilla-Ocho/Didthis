import { observer } from 'mobx-react-lite'
import { useStore } from '@/lib/store'
import { LogoutButton } from '@/components/auth/LogoutButton'
import { Divider, Link, PagePad } from './uiLib'
import branding from '@/lib/branding'
import LogoWordmarkSvg from '@/assets/img/didthis_wordmark_light.svg'
import Image from 'next/image'
import { LoginButton } from './auth/LoginButton'
import { trackingEvents } from '@/lib/trackingEvents'
import useAppShell from '@/lib/appShellContent'

// TODO: isThe404 should be called 'isStatic' and StaticLayout component is misleadingly named.

const AppHeader = observer(({ isThe404, hideLogin }: { isThe404?: boolean; hideLogin?: boolean }) => {
  const store = useStore()
  const appShell = useAppShell()

  // Hide this component when viewed in the native app shell.
  if (appShell.inAppWebView || hideLogin) return <></>

  return (
    <div>
      <PagePad wide noPadY>
        {store.user ? (
          <div className="flex items-center py-4">
            <Link
              intent="internalNav"
              href="/"
              trackEvent={trackingEvents.bcHeaderLogo}
            >
              <h1 className="text-3xl leading-none p-0 m-0">
                <Image src={LogoWordmarkSvg} alt={branding.productName} />
              </h1>
            </Link>
            <div className="text-right text-sm flex-grow">
              {store.inTrialBlankSlate() ?
              <LoginButton intent="headerNav" />
              :
              <LogoutButton intent="headerNav" />}
            </div>
          </div>
        ) : (
          <div className="flex items-center py-2 justify-center md:justify-full">
            {!isThe404 && (
              <div className="sm:hidden basis-2/6">
                {/* this div here to make the logo centered on mobile */}
              </div>
            )}
            <Link
              intent="internalNav"
              href="/"
              trackEvent={trackingEvents.bcHeaderLogo}
              className="sm:flex-grow"
            >
              <h1 className="text-3xl leading-none p-0 m-0">
                <Image src={LogoWordmarkSvg} alt={branding.productName} />
              </h1>
            </Link>
            {!(isThe404 || hideLogin) && (
              <div className="basis-2/6 text-right text-sm">
                <LoginButton intent="link" />
              </div>
            )}
          </div>
        )}
      </PagePad>
      <Divider className="m-0" />
    </div>
  )
})

export default AppHeader
