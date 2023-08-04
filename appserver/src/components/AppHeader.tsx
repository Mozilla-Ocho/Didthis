import { observer } from 'mobx-react-lite'
import { useStore } from '@/lib/store'
import { LogoutButton } from '@/components/auth/LogoutButton'
import { Divider, Link, PagePad } from './uiLib'
import branding from '@/lib/branding'
import LogoWordmarkSvg from '@/assets/img/didthis_wordmark_light.svg'
import Image from 'next/image'
import { LoginButton } from './auth/LoginButton'
import { trackingEvents } from '@/lib/trackingEvents'

const AppHeader = observer(({ isThe404 }: { isThe404?: boolean }) => {
  const store = useStore()
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
              <LogoutButton intent="headerNav" />
            </div>
          </div>
        ) : (
          <div className="flex items-center py-2 justify-center md:justify-full">
            <Link
              intent="internalNav"
              href="/"
              trackEvent={trackingEvents.bcHeaderLogo}
            >
              <h1 className="text-3xl leading-none p-0 m-0">
                <Image src={LogoWordmarkSvg} alt={branding.productName} />
              </h1>
            </Link>
            {!isThe404 && (
              <div className="hidden md:block text-right text-sm flex-grow">
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
