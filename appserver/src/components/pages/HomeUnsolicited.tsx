import { observer } from 'mobx-react-lite'
import { PagePad } from '@/components/uiLib'
import { LogoutButton } from '../auth/LogoutButton'
import {useStore} from '@/lib/store'
import {trackingEvents} from '@/lib/trackingEvents'

const HomeUnsolicited = observer(() => {
  const store = useStore()
  store.useTrackedPageEvent(trackingEvents.pvUnsolicited)
  return (
    <>
      <PagePad>
        <h4>Invitation required</h4>
        <p className="my-4">
          Oops, accounts are currently invitation-only. Your account does not
          yet have access. You must sign up or sign in using a specific link
          containing an invite code. You can sign up for our waitlist from the
          home page if you log out.
        </p>
        <LogoutButton />
      </PagePad>
    </>
  )
})

export default HomeUnsolicited
