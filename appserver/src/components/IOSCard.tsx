import { trackingEvents } from '@/lib/trackingEvents'
import { observer } from 'mobx-react-lite'
import { Link } from './uiLib'
import branding from '@/lib/branding'
import { useStore } from '@/lib/store'

const IOSCard = observer(() => {
  const store = useStore()
  if (!store.isAppleUserAgentOnWebApp()) return null
  return (
    <div className="border border-[#999] border-edges border-dashed rounded-md overflow-hidden">
      <div className="p-6">
        <h5 className="mt-4 mb-2 text-md">
          <Link
            external
            href={branding.iOSAppStoreURLAuthed}
            trackEvent={trackingEvents.bcAppStoreAuthed}
          >
            Try the iOS app
          </Link>
        </h5>

        <p className="break-words my-2 whitespace-pre-line min-h-[44px] text-sm mb-4">
          <span className="text-form-labels">
            Get the best experience on your iPhone or iPad with{' '}
            <Link
              external
              href={branding.iOSAppStoreURLAuthed}
              trackEvent={trackingEvents.bcAppStoreAuthed}
            >
              Didthis for iOS
            </Link>{' '}(US and Canada)
          </span>
        </p>
      </div>
    </div>
  )
})

export default IOSCard
