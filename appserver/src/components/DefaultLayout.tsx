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
        <StaticLayout isThe404={isThe404} unauthHomepage={unauthHomepage}>{children}</StaticLayout>
      </StoreLoadingWrapper>
    )
  }
)

export default function DefaultLayout({
  authUser,
  signupCode,
  children,
  unauthHomepage,
  isThe404,
}: {
  authUser: ApiUser | false
  signupCode: false | string
  children: ReactNode // ReactNode not ReactElement
  unauthHomepage?: boolean
  isThe404?: boolean
}) {
  const router = useRouter()
  return (
    <div id={appRootDivId}>
      <Head><title>{branding.productName}</title></Head>
      <StoreWrapper authUser={authUser} signupCode={signupCode} router={router}>
        <Inner isThe404={isThe404} unauthHomepage={unauthHomepage}>{children}</Inner>
      </StoreWrapper>
    </div>
  )
}
