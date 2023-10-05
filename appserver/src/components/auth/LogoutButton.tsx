import { Button, ConfirmationModal, Link } from '@/components/uiLib'
import { observer } from 'mobx-react-lite'
import { useStore } from '@/lib/store'
import { trackingEvents } from '@/lib/trackingEvents'
import { useState } from 'react'
import { ClaimTrialAccountButton } from '../auth/ClaimTrialAccountButton'
import branding from '@/lib/branding'

const LogoutButton = observer(
  ({
    intent,
    text,
    onLogout,
    'data-testid': dataTestid,
  }: {
    intent?: React.ComponentProps<typeof Button>['intent']
    text?: string
    onLogout?: () => void
    'data-testid'?: string
  }) => {
    const [modalOpen, setModalOpen] = useState(false)

    const store = useStore()

    const user = store.user
    if (!user) return <></>

    const handleClick = () => {
      if (!user.isTrial) {
        completeLogout()
      } else {
        setModalOpen(true)
      }
    }

    const handleLogoutCancel = () => {
      setModalOpen(false)
    }

    const completeLogout = () => {
      setModalOpen(false)
      // TODO: does this logout event get reliably tracked? because we will
      // reload the page after this.
      store.trackEvent(trackingEvents.bcLogout, {
        loseTrialWork: store.inTrialWithContent() ? 'y' : 'n',
      })
      store.logOut()
      onLogout && onLogout()
    }

    const defaultText = 'Sign out'
    return (
      <>
        <Button
          onClick={handleClick}
          intent={intent}
          data-testid={dataTestid || 'loginButton'}
        >
          {text || defaultText}
        </Button>
        <ConfirmationModal
          isOpen={modalOpen}
          title={'Lose unsaved posts and projects?'}
          yesText="Yes"
          noText="No"
          onYes={completeLogout}
          onNo={handleLogoutCancel}
          onClose={handleLogoutCancel}
        >
          <p>
            Because you haven’t{' '}
            <ClaimTrialAccountButton
              text="signed up"
              intent="link"
              className="text-base"
            />{' '}
            for {branding.productName}, any projects and posts you’ve created
            are not saved and will be lost.
          </p>
          <p className="mt-6 mb-6">
            Are you sure you want to sign out and lose your work?
          </p>
        </ConfirmationModal>
      </>
    )
  }
)

export { LogoutButton }
