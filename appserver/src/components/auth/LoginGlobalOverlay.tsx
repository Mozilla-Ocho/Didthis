import { useEffect, useMemo } from 'react'
import { ConfirmationModal, Modal, Button, Link } from '@/components/uiLib'
import { observer } from 'mobx-react-lite'
import log from '@/lib/log'
import { useStore } from '@/lib/store'
import { StyledFirebaseAuth } from '@/components/auth/StyledFirebaseAuth'
import branding from '@/lib/branding'
import pathBuilder from '@/lib/pathBuilder'
import AppleSignIn from './AppleSignIn'

const LoginGlobalOverlay = observer(() => {
  const store = useStore()
  useEffect(() => {
    // client only, not on server
    store.initFirebase()
  })
  const firebaseUiConfig = useMemo(() => {
    if (!store.firebaseRefNonReactive) return {}
    const firebaseUiConfig = {
      signInFlow: 'popup',
      signInOptions: [
        {
          provider:
            store.firebaseRefNonReactive.auth.EmailAuthProvider.PROVIDER_ID,
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
  }, [store, store.firebaseRefNonReactive])

  if (!store.hasFirebaseRef) {
    // not initialized yet
    return <></>
  }

  return (
    <div>
      <ConfirmationModal
        isOpen={store.loginErrorMode === '_inactive_code_'}
        title="Invalid invite code"
        noText="Ok"
        onNo={store.cancelGlobalLoginOverlay}
        onClose={store.cancelGlobalLoginOverlay}
      >
        <div>
          <p>
            The sign-up invite code on this link is not valid for creating new
            accounts. It may have been copy/pasted incorrectly, or has expired.
            If you already have an account, you can still log in normally:
          </p>
          <Button
            intent="primary"
            className="w-full mt-4"
            onClick={() => store.launchGlobalLoginOverlay(true)}
          >
            Log in with email
          </Button>
        </div>
      </ConfirmationModal>
      <ConfirmationModal
        isOpen={store.signinModalOpen}
        title=" "
        onNo={store.cancelGlobalLoginOverlay}
        onClose={store.cancelGlobalLoginOverlay}
        closeX
      >
        <div>
          <Button
            intent="primary"
            className="w-full mt-4 text-lg"
            onClick={() => store.launchFirebaseLoginOverlay()}
          >
            Sign in with Email
          </Button>
          <AppleSignIn
            width="100%"
            height="48"
            onCancel={store.cancelGlobalLoginOverlay}
            onSuccess={store.cancelGlobalLoginOverlay}
          />
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
          firebaseAuth={store.firebaseRefNonReactive.auth()}
        />
        <p className="p-3 text-center text-sm">
          By proceeding, you agree to the {branding.productName}
          <br />
          <Link newTab href={pathBuilder.legal('tos')}>
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link newTab href={pathBuilder.legal('pp')}>
            Privacy Notice
          </Link>
        </p>
      </Modal>
    </div>
  )
})

export { LoginGlobalOverlay }
