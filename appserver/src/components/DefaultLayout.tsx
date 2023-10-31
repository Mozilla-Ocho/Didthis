import type { ReactNode } from 'react'
import { StoreWrapper, StoreLoadingWrapper, useStore } from '@/lib/store'
import { LoginGlobalOverlay } from '@/components/auth/LoginGlobalOverlay'
import StaticLayout from './StaticLayout'
import { observer } from 'mobx-react-lite'
import HomeUnsolicited from './pages/HomeUnsolicited'
import DeletionConfirmationModal from './DeletionConfirmationModal'
import { useRouter } from 'next/router'
import { appRootDivId } from './uiLib/Modal'
import Head from 'next/head'
import branding from '@/lib/branding'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import AppShellContextProvider from '@/lib/appShellContent/context'

// Inner is separate because it has to be a store observer for when
// headerFooter=authed and the outer layer is the store provider itself.
const Inner = observer(
  ({
    children,
    unauthHomepage,
    isThe404,
  }: {
    children: ReactNode
    unauthHomepage?: boolean
    isThe404?: boolean
  }) => {
    const store = useStore()
    if (store.user && store.user.unsolicited) {
      return (
        <StoreLoadingWrapper>
          <LoginGlobalOverlay />
          <StaticLayout isThe404={isThe404}>
            <HomeUnsolicited />
          </StaticLayout>
        </StoreLoadingWrapper>
      )
    }
    return (
      <StoreLoadingWrapper>
        <LoginGlobalOverlay />
        <DeletionConfirmationModal />
        <StaticLayout isThe404={isThe404} unauthHomepage={unauthHomepage}>
          {children}
        </StaticLayout>
      </StoreLoadingWrapper>
    )
  }
)

export default function DefaultLayout({
  authUser,
  signupCodeInfo,
  children,
  unauthHomepage,
  isThe404,
  testBucket,
}: {
  authUser: ApiUser | false
  signupCodeInfo?: false | ApiSignupCodeInfo
  children: ReactNode // ReactNode not ReactElement
  unauthHomepage?: boolean
  isThe404?: boolean
  // bucketed tests are not in use everywhere so this is undefined in a bunch
  // of pages.
  testBucket?: TestBucket
}) {
  const router = useRouter()
  return (
    <div id={appRootDivId}>
      <Head>
        <title>{branding.productName}</title>
      </Head>
      <StoreWrapper
        authUser={authUser}
        signupCodeInfo={signupCodeInfo || false}
        router={router}
        testBucket={testBucket}
      >
        <AppShellContextProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Inner isThe404={isThe404} unauthHomepage={unauthHomepage}>
              {children}
            </Inner>
          </LocalizationProvider>
        </AppShellContextProvider>
      </StoreWrapper>
    </div>
  )
}
