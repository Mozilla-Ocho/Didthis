import type { ReactNode } from 'react'
import { StoreWrapper, StoreLoadingWrapper, useStore } from '@/lib/store'
import { LoginGlobalOverlay } from '@/components/auth/LoginGlobalOverlay'
import StaticLayout from './StaticLayout'
import { observer } from 'mobx-react-lite'

// Inner is separate because it has to be a store observer for when
// headerFooter=authed and the outer layer is the store provider itself.
const Inner = observer(
  ({
    headerFooter,
    children,
  }: {
    headerFooter: 'always' | 'authed' | 'never'
    children: ReactNode
  }) => {
    const store = useStore()
    const hf =
      headerFooter === 'always' || (headerFooter === 'authed' && !!store.user)
    return (
      <StoreLoadingWrapper ifLoading={<p>loading</p>}>
        <LoginGlobalOverlay />
        <StaticLayout withHeaderFooter={hf}>{children}</StaticLayout>
      </StoreLoadingWrapper>
    )
  }
)

export default function DefaultLayout({
  authUser,
  signupCode,
  headerFooter,
  children,
}: {
  authUser: ApiUser | false
  signupCode: false | string
  headerFooter: 'always' | 'authed' | 'never'
  children: ReactNode // ReactNode not ReactElement
}) {
  return (
    <StoreWrapper authUser={authUser} signupCode={signupCode}>
      <Inner headerFooter={headerFooter}>{children}</Inner>
    </StoreWrapper>
  )
}
