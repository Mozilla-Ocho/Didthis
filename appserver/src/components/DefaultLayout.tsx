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
    wide,
    unauthHomepage,
  }: {
    children: ReactNode,
    wide?: boolean
    unauthHomepage?: boolean
  }) => {
    const store = useStore()
    if (store.user && store.user.unsolicited) {
      return (
        <StoreLoadingWrapper ifLoading={<p>loading</p>}>
          <LoginGlobalOverlay />
          <StaticLayout wide={wide}><HomeUnsolicited /></StaticLayout>
        </StoreLoadingWrapper>
      )
    }
    return (
      <StoreLoadingWrapper ifLoading={<p>loading</p>}>
        <LoginGlobalOverlay />
        <DeletionConfirmationModal />
        <StaticLayout unauthHomepage={unauthHomepage} wide={wide}>{children}</StaticLayout>
      </StoreLoadingWrapper>
    )
  }
)

export default function DefaultLayout({
  authUser,
  signupCode,
  children,
  wide,
  unauthHomepage,
}: {
  authUser: ApiUser | false
  signupCode: false | string
  children: ReactNode // ReactNode not ReactElement
  wide?: boolean,
  unauthHomepage?: boolean,
}) {
  const router = useRouter()
  return (
    <StoreWrapper authUser={authUser} signupCode={signupCode} router={router}>
      <Inner wide={wide} unauthHomepage={unauthHomepage}>{children}</Inner>
    </StoreWrapper>
  )
}
