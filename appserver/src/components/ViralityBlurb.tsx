import { Link, PagePad } from '@/components/uiLib'
import { useStore } from '@/lib/store'
import branding from '@/lib/branding'
import { trackingEvents } from '@/lib/trackingEvents'

const ViralityBlurb = ({
  fromPage,
  targetUserSlug,
}: {
  fromPage: string
  targetUserSlug: string
}) => {
  // per sunset plan, we are no longer showing this CTA
  return <></>
  /*
  const store = useStore()
  if (store.user) return <></> // unauth only
  return (
    <PagePad wide noPadY>
      <div className={`text-center sm:text-left py-4 px-6 mt-4 bg-discordnag`}>
        <p className="text-sm">
          Like what you see here?{' '}
          <span className="whitespace-nowrap">
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
          </span>
        </p>
      </div>
    </PagePad>
  )
  */
}

export default ViralityBlurb
