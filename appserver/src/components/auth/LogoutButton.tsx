import { Button, ConfirmationModal, Link } from '@/components/uiLib'
import { observer } from 'mobx-react-lite'
import { useStore } from '@/lib/store'
import { trackingEvents } from '@/lib/trackingEvents'
import { useState } from 'react'

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

    const hasProjects = Object.keys(user.profile.projects).length > 0
    const hasProfileEdits =
      user.profile.name || user.userSlug || user.profile.imageAssetId
    const inBlankSlate = !hasProjects && !hasProfileEdits
    if (inBlankSlate && user.isTrial) return <></>

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
      store.trackEvent(trackingEvents.bcLogout)
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
          title={'Abandon your trial account?'}
          yesText="Yes"
          noText="No"
          onYes={completeLogout}
          onNo={handleLogoutCancel}
          onClose={handleLogoutCancel}
        >
          <p>
            You cannot access this trial account again without having{' '}
            <Link
              href={`/user/${user.systemSlug}/edit`}
              trackEvent={trackingEvents.bcTrialAccountNag}
            >
              <strong>claimed it</strong>
            </Link>{' '}
            with an email address and password.
          </p>
          <p className="mt-6 mb-6">Are you sure you want to sign out?</p>
        </ConfirmationModal>
      </>
    )
  }
)

export { LogoutButton }
