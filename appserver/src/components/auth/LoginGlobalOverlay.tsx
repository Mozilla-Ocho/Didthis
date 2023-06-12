import { ReactNode, useEffect } from 'react'
import { ConfirmationModal, Modal, Button } from '@/components/uiLib'
import { observer } from 'mobx-react-lite'
import log from '@/lib/log'
import { useStore } from '@/lib/store'
import { StyledFirebaseAuth } from '@/components/auth/StyledFirebaseAuth'

// XXX_SKELETON
const LoginGlobalOverlay = observer(() => {
  const store = useStore()
  useEffect(() => {
    // client only, not on server
    store.initFirebase()
  })

  // XXX_PORTING i deleted the confirmation modals for now

  let styledFbUi: ReactNode = <></>
  if (store.firebaseModalOpen) {
    // note the store loads firebase async, so this is inside the
    // firebaseModalOpen condition, outside this it could fail w/ uninitialized
    // firebase instance.
    const firebaseUiConfig = {
      signInFlow: 'popup',
      signInOptions: [
        {
          provider: store.firebaseRef.auth.EmailAuthProvider.PROVIDER_ID,
          requireDisplayName: false,
        },
      ],
      callbacks: {
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        signInSuccessWithAuthResult: (authResult: any) => {
          // note that the logic to handle the new auth state is in the store, on
          // the onAuthStateChanged callback, here all we do is show a spinner
          // until the store finishes.
          // TODO: this is optimistic thinking, we show a spinner until we assume
          // the store finishes acquiring auth, but if there's an error in that
          // process, this would just spin forever. the store currently forces
          // a page reload on an error during this process, so that's a bad
          // hack.
          log.auth('signInSuccessWithAuthResult', authResult)
          return false
        },
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        signInFailure: (error: any) => {
          log.auth('signInFailure', error)
          store.cancelGlobalLoginOverlay()
          return false
        },
      },
    }
    /* note global/styles.css has an override for the firebase auth ui */
    styledFbUi = (
      <StyledFirebaseAuth
        uiConfig={firebaseUiConfig}
        firebaseAuth={store.firebaseRef.auth()}
      />
    )
  }

  return (
    <div>
      <ConfirmationModal
        isOpen={store.loginErrorMode === '_inactive_code_'}
        title="Expired invite code"
        noText="Ok"
        onNo={store.cancelGlobalLoginOverlay}
        onClose={store.cancelGlobalLoginOverlay}
      >
        <div>
          <p>
            The sign-up invite code you used is no longer active for creating
            new accounts. If you already have an account, you can still log in
            normally:
          </p>
          <Button
            intent="primary"
            loading={store.loginButtonsSpinning}
            onClick={() => store.launchGlobalLoginOverlay(true)}
          >
            Log in with existing account
          </Button>
        </div>
      </ConfirmationModal>
      <Modal
        title={'Log in or Sign up'}
        hideTitle
        noPad
        isOpen={store.firebaseModalOpen}
        handleClose={store.cancelGlobalLoginOverlay}
      >
        {styledFbUi}
      </Modal>
    </div>
  )
})

export { LoginGlobalOverlay }
