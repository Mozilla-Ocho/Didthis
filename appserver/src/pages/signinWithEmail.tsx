import { useEffect, useMemo } from 'react'
import { observer } from 'mobx-react-lite'
import { GetServerSidePropsContext } from 'next'
import { useStore } from '@/lib/store'
import DefaultLayout from '@/components/DefaultLayout'
import { StyledFirebaseAuth } from '@/components/auth/StyledFirebaseAuth'
import log from '@/lib/log'
import { sessionCookieName } from '@/lib/apiConstants'
import { getServerSideProps as indexPageGetServerSideProps } from '@/pages/index'
import { PagePad } from '@/components/uiLib'
import useAppShell from '@/lib/appShellContent'
import Loading from '@/components/pages/Loading'

const Signin = observer(({ sessionCookie }: { sessionCookie?: string }) => {
  const store = useStore()
  const appShell = useAppShell()

  useEffect(() => {
    if (store.user && typeof sessionCookie !== 'undefined') {
      if (appShell.appReady) {
        appShell.api.request('signinWithSession', { sessionCookie })
      } else if (!appShell.inAppWebView) {
        // redirect to home, in case this is viewed outside the app
        window.location.assign(`/`)
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
      </PagePad>
    </div>
  )
})

const Wrapper = ({
  authUser,
  sessionCookie,
  signupCodeInfo,
  testBucket,
}: {
  authUser: ApiUser | false
  sessionCookie?: string
  signupCodeInfo: ApiSignupCodeInfo | false
  testBucket: TestBucket
}) => {
  return (
    <DefaultLayout
      hideLogin
      authUser={authUser}
      signupCodeInfo={signupCodeInfo}
      unauthHomepage={!authUser}
      testBucket={testBucket}
    >
      <Signin sessionCookie={sessionCookie} />
    </DefaultLayout>
  )
}

export default Wrapper

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const indexProps = await indexPageGetServerSideProps(context)
  const sessionCookie = context.req.cookies[sessionCookieName] || null
  return {
    props: {
      ...indexProps.props,
      sessionCookie,
    },
  }
}
