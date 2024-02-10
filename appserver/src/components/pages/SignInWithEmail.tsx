import { useEffect, useMemo } from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '@/lib/store'
import { StyledFirebaseAuth } from '@/components/auth/StyledFirebaseAuth'
import log from '@/lib/log'
import { PagePad } from '@/components/uiLib'
import useAppShell from '@/lib/appShellContent'
import Loading from '@/components/pages/Loading'
import { Link } from '@/components/uiLib'
import branding from '@/lib/branding'
import pathBuilder from '@/lib/pathBuilder'

const SigninWithEmail = observer(
  ({ sessionCookie }: { sessionCookie?: string }) => {
    const store = useStore()
    const appShell = useAppShell()

    useEffect(() => {
      if (store.user && typeof sessionCookie !== 'undefined') {
        if (appShell.appReady) {
          appShell.api.request('signinWithSession', { sessionCookie })
        } else if (!appShell.inAppWebView) {
          // redirect to home, in case this is viewed outside the app
          setTimeout(() => window.location.assign(`/`), 1000);
        }
      }
    }, [
      store.user,
      appShell.appReady,
      appShell.inAppWebView,
      appShell.api,
      sessionCookie,
    ])

    useEffect(() => {
      // client only, not on server
      store.initFirebase()
    })

    const firebaseUiConfig = useMemo(() => {
      if (!store.firebaseRefNonReactive) return {}
      const firebaseUiConfig = {
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
      /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [store, store.firebaseRefNonReactive])

    if (store.user && sessionCookie) {
      // logged in already
      return <Loading />
    }

    if (!store.hasFirebaseRef) {
      // not initialized yet
      return <></>
    }

    return (
      <div className="grid grid-rows-[auto_1fr_auto] w-full min-h-screen">
        <PagePad wide>
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

        </PagePad>
      </div>
    )
  }
)

export default SigninWithEmail
