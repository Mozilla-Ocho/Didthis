import { PagePad } from '@/components/uiLib'
import { useStore } from '@/lib/store'
import branding from '@/lib/branding'
import { WaitlistButton } from './WaitlistButton'

const ViralWaitlistBlurb = ({
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
          <WaitlistButton
            mode="viral"
            fromPage={fromPage}
            targetUserSlug={targetUserSlug}
          />{' '}
          now to get your own {branding.productName} page.
        </p>
      </div>
    </PagePad>
  )
}

export default ViralWaitlistBlurb
