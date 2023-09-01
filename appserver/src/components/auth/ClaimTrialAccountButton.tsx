import { Button, ConfirmationModal } from '@/components/uiLib'
import { observer } from 'mobx-react-lite'
import { useStore } from '@/lib/store'
import { trackingEvents } from '@/lib/trackingEvents'
import branding from '@/lib/branding'
import { useState } from 'react'

const ClaimTrialAccountButton = observer(
  ({
    intent,
    text,
    'data-testid': dataTestid,
    className,
    skipConfirmation = false,
  }: {
    intent?: React.ComponentProps<typeof Button>['intent']
    text?: string
    'data-testid'?: string
    className?: string
    skipConfirmation?: boolean
  }) => {
    const store = useStore()
    const [modalOpen, setModalOpen] = useState(false)

    const handleClick = () => {
      if (skipConfirmation) {
        store.beginClaimTrialAccount()
      } else {
        setModalOpen(true)
      }
      store.trackEvent(trackingEvents.bcClaimTrialAccount)
    }
    const handleClaimCancel = () => {
      setModalOpen(false)
      store.trackEvent(trackingEvents.bcCancelClaimTrialAccount)
    }
    const completeClaim = () => {
      setModalOpen(false)
      store.beginClaimTrialAccount()
    }

    return (
      <>
        <Button
          onClick={handleClick}
          intent={intent}
          data-testid={dataTestid || 'ClaimTrialAccountButton'}
          className={className}
        >
          {text || branding.claimAccountButtonTxt}
        </Button>
        <ConfirmationModal
          isOpen={modalOpen}
          title={'Claim account'}
          yesText="Claim account"
          noText="Not now"
          onYes={completeClaim}
          onNo={handleClaimCancel}
          onClose={handleClaimCancel}
        >
          <p>
            In order to be able to share your project out to others, you will
            need to claim your {branding.productName} account with an email
            address and password.
          </p>
          <p className="mt-6 mb-6">Do you want to claim your account now?</p>
        </ConfirmationModal>
      </>
    )
  }
)

export { ClaimTrialAccountButton }
