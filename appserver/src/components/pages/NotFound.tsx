import { PagePad } from '@/components/uiLib'
import {useStore} from '@/lib/store'
import {trackingEvents} from '@/lib/trackingEvents'
import { ReactNode } from 'react'

const NotFound = ({ children }: { children?: ReactNode }) => {
  const store = useStore()
  store.useTrackedPageEvent(trackingEvents.pvNotFound)
  return (
    <PagePad wide>
      <div className="pt-10 text-center">
        <h5 className="m-4">There’s nothing here!</h5>
        {children ? (
          children
        ) : (
          <p className="text-form-labels text-sm">Page not found</p>
        )}
      </div>
    </PagePad>
  )
}

export default NotFound
