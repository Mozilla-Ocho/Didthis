import type { ReactNode } from 'react'
import { StoreWrapper, StoreLoadingWrapper, useStore } from '@/lib/store'
import { LoginGlobalOverlay } from '@/components/auth/LoginGlobalOverlay'
import StaticLayout from './StaticLayout'
import { observer } from 'mobx-react-lite'
import HomeUnsolicited from './pages/HomeUnsolicited'
import DeletionConfirmationModal from './DeletionConfirmationModal'
import {useRouter} from 'next/router'

// Inner is separate because it has to be a store observer for when
// headerFooter=authed and the outer layer is the store provider itself.
const Inner = observer(
  ({
    children,
  }: {
    children: ReactNode,
  }) => {
    const store = useStore()
    const router = useRouter()
    if (store.user && store.user.unsolicited) {
      return (
        <StoreLoadingWrapper ifLoading={<p>loading</p>}>
          <LoginGlobalOverlay />
          <StaticLayout><HomeUnsolicited /></StaticLayout>
        </StoreLoadingWrapper>
      )
    }
    const skipLayout = router.pathname === 'index' && !store.user
    if (skipLayout) {
      return (
        <StoreLoadingWrapper ifLoading={<p>loading</p>}>
          <LoginGlobalOverlay />
          <DeletionConfirmationModal />
          {children}
        </StoreLoadingWrapper>
      )
    }
    return (
      <StoreLoadingWrapper ifLoading={<p>loading</p>}>
        <LoginGlobalOverlay />
        <DeletionConfirmationModal />
        <StaticLayout>{children}</StaticLayout>
      </StoreLoadingWrapper>
    )
  }
)

export default function DefaultLayout({
  authUser,
  signupCode,
  children,
}: {
  authUser: ApiUser | false
  signupCode: false | string
  children: ReactNode // ReactNode not ReactElement
}) {
  const router = useRouter()
  return (
    <StoreWrapper authUser={authUser} signupCode={signupCode} router={router}>
      <Inner>{children}</Inner>
    </StoreWrapper>
  )
}
