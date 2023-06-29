import type { ReactNode } from 'react'
import { StoreWrapper, StoreLoadingWrapper, useStore } from '@/lib/store'
import { LoginGlobalOverlay } from '@/components/auth/LoginGlobalOverlay'
import StaticLayout from './StaticLayout'
import { observer } from 'mobx-react-lite'
import HomeUnsolicited from './pages/HomeUnsolicited'
import DeletionConfirmationModal from './DeletionConfirmationModal'
import { useRouter } from 'next/router'
import { appRootDivId } from './uiLib/Modal'

// Inner is separate because it has to be a store observer for when
// headerFooter=authed and the outer layer is the store provider itself.
const Inner = observer(
  ({
    children,
    unauthHomepage,
  }: {
    children: ReactNode
    unauthHomepage?: boolean
  }) => {
    const store = useStore()
    if (store.user && store.user.unsolicited) {
      return (
        <StoreLoadingWrapper>
          <LoginGlobalOverlay />
          <StaticLayout>
            <HomeUnsolicited />
          </StaticLayout>
        </StoreLoadingWrapper>
      )
    }
    return (
      <StoreLoadingWrapper>
        <LoginGlobalOverlay />
        <DeletionConfirmationModal />
        <StaticLayout unauthHomepage={unauthHomepage}>{children}</StaticLayout>
      </StoreLoadingWrapper>
    )
  }
)

export default function DefaultLayout({
  authUser,
  signupCode,
  children,
  unauthHomepage,
}: {
  authUser: ApiUser | false
  signupCode: false | string
  children: ReactNode // ReactNode not ReactElement
  unauthHomepage?: boolean
}) {
  const router = useRouter()
  return (
    <div id={appRootDivId}>
      <StoreWrapper authUser={authUser} signupCode={signupCode} router={router}>
        <Inner unauthHomepage={unauthHomepage}>{children}</Inner>
      </StoreWrapper>
    </div>
  )
}
