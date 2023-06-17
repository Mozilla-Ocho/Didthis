import { observer } from 'mobx-react-lite'
import { H } from '@/components/uiLib'
import { LogoutButton } from '../auth/LogoutButton'

const HomeUnsolicited = observer(() => {
  return (
    <>
      <div>
        <H.H4>Invitation required</H.H4>
        <p>
          Oops, accounts are currently invitation-only. Your account does not
          yet have access. You must sign up or sign in using a specific link
          containing an invite code. You can sign up for our waitlist from the
          home page if you log out.
        </p>
        <LogoutButton />
      </div>
    </>
  )
})

export default HomeUnsolicited
