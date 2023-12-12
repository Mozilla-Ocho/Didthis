import { Link, PagePad } from '@/components/uiLib'
import { useStore } from '@/lib/store'
import branding from '@/lib/branding'
import { trackingEvents } from '@/lib/trackingEvents'
// import { WaitlistButton } from './WaitlistButton'

const ViralityBlurb = ({
  fromPage,
  targetUserSlug,
}: {
  fromPage: string
  targetUserSlug: string
}) => {
  const store = useStore()
  if (store.user) return <></> // unauth only
  return (
    <PagePad wide noPadY>
      <div className={`py-4 px-6 mt-4 bg-discordnag`}>
        <p className="text-sm">
          Like what you see here?{' '}
          <strong>
            <Link
              href="/"
              trackEvent={trackingEvents.bcGetYourOwnPage}
              trackEventOpts={{ fromPage, targetUserSlug }}
            >
              Get your own {branding.productName} page
            </Link>{' '}
            &rarr;
          </strong>
        </p>
      </div>
    </PagePad>
  )
}

export default ViralityBlurb
