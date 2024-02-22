import { useEffect, useRef, useState, useCallback } from 'react'

// {{ this is from https://github.com/firebase/firebaseui-web-react/pull/173#issuecomment-1151532176
// because the firebaseui react library is an unmaintained project that doesn't
// work under react strict mode and looks like it never will.
import { onAuthStateChanged } from 'firebase/auth'
// import * as firebaseui from 'firebaseui'; // see below, doing dynamic import now for nextjs SSR compat
import 'firebaseui/dist/firebaseui.css'

/* eslint-disable @typescript-eslint/no-explicit-any */
type StyledFirebaseAuthProps = {
  uiConfig: any
  firebaseAuth: any
  className?: string
  uiCallback?: (authUI: firebaseui.auth.AuthUI) => void
}
/* eslint-enable @typescript-eslint/no-explicit-any */

const StyledFirebaseAuth = (props: StyledFirebaseAuthProps) => {
  const firebaseui = useFirebaseUI()
  const [userSignedIn, setUserSignedIn] = useState(false)
  const elementRef = useRef<HTMLDivElement | null>(null)
  const elementRefCurrent = elementRef.current

  useEffect(() => {
    const { uiConfig, firebaseAuth, uiCallback } = props

    // Bail out on setting up auth UI until both firebaseui and the target
    // element are available
    if (!firebaseui || !elementRefCurrent) return

    const firebaseUiWidget =
      firebaseui.auth.AuthUI.getInstance() ||
      new firebaseui.auth.AuthUI(firebaseAuth)

    if (uiConfig.signInFlow === 'popup') firebaseUiWidget.reset()

    const unregisterAuthObserver = onAuthStateChanged(firebaseAuth, user => {
      if (!user && userSignedIn) firebaseUiWidget.reset()
      setUserSignedIn(!!user)
    })
    if (uiCallback) uiCallback(firebaseUiWidget)
    firebaseUiWidget.start(elementRefCurrent, uiConfig)

    return () => {
      unregisterAuthObserver()
      firebaseUiWidget.reset()
    }
  }, [firebaseui, elementRefCurrent, userSignedIn, props])

  return <div className={props.className} ref={elementRef} />
}

// Wrap the async import of firebaseui in tracking state
function useFirebaseUI() {
  const [firebaseui, setFirebaseUi] = useState<null | FirebaseUI>(null)
  useEffect(() => {
    importFirebaseUI().then(result => setFirebaseUi(result))
  }, [setFirebaseUi])
  return firebaseui
}

async function importFirebaseUI() {
  return import('firebaseui')
}

type FirebaseUI = Awaited<ReturnType<typeof importFirebaseUI>>

export { StyledFirebaseAuth }
