import { Link, PagePad } from '@/components/uiLib'
import { useStore } from '@/lib/store'
import { trackingEvents } from '@/lib/trackingEvents'
import RemindersAndAlerts from '../RemindersAndAlerts'
import PageTitle from '../PageTitle'
import { useAppShellTopBar } from '@/lib/appShellContent'
import branding from '@/lib/branding'

const Support = () => {
  const store = useStore()
  store.useTrackedPageEvent(trackingEvents.pvSupport)

  useAppShellTopBar({
    show: true,
    title: '',
    leftIsBack: true,
    leftLabel: 'Back',
    onLeftPress: () => store.goBack(),
  })

  return (
    <>
      <RemindersAndAlerts />
      <PagePad semiWide>
        <PageTitle title="Support" />
        <div className="prose text-md text-bodytext">
          <h3>Product Support</h3>
          <p>Need help with {branding.productName}? You can:</p>
          <ul>
            <li>
              Join our{' '}
              <span className="whitespace-nowrap">
                <Link
                  external
                  href="https://discord.gg/Z9f8UjdfJx"
                  trackEvent={trackingEvents.bcDiscordNag}
                >
                  private Discord server
                </Link>
              </span>
            </li>
            <li>
              Or, email us at{' '}
              <a href={'mailto:' + branding.supportEmail}>
                {branding.supportEmail}
              </a>
            </li>
          </ul>
          <p>We’re happy to help. Thanks for using {branding.productName}!</p>
        </div>
      </PagePad>
    </>
  )
}

export default Support
