import { useEffect, useMemo } from 'react'
import { ConfirmationModal, Modal, Button } from '@/components/uiLib'
import { observer } from 'mobx-react-lite'
import log from '@/lib/log'
import { useStore } from '@/lib/store'
import { StyledFirebaseAuth } from '@/components/auth/StyledFirebaseAuth'

const LoginGlobalOverlay = observer(() => {
  const store = useStore()
  useEffect(() => {
    // client only, not on server
    store.initFirebase()
  })
  const firebaseUiConfig = useMemo(() => {
    if (!store.firebaseRef) return {}
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
    return firebaseUiConfig
    // eslint doesn't understand that store is a context object and the
    // firebaseRef property can change without the top level store changing.
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [store, store.firebaseRef])

  if (!store.firebaseRef) {
    // not initialized yet
    return <></>
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
            className="w-full mt-4"
            loading={store.loginButtonsSpinning}
            onClick={() => store.launchGlobalLoginOverlay(true)}
          >
            Log in with existing account
          </Button>
        </div>
      </ConfirmationModal>
      <Modal
        srTitle={'Log in or Sign up'}
        noPad
        isOpen={store.firebaseModalOpen}
        handleClose={store.cancelGlobalLoginOverlay}
      >
        <StyledFirebaseAuth
          uiConfig={firebaseUiConfig}
          firebaseAuth={store.firebaseRef.auth()}
        />
        <p className="p-3 text-center text-sm">Legal message here TODO</p>
      </Modal>
    </div>
  )
})

export { LoginGlobalOverlay }
