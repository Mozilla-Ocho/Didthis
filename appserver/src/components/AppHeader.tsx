import { observer } from 'mobx-react-lite'
import { useStore } from '@/lib/store'
import { LogoutButton } from '@/components/auth/LogoutButton'
import { Divider, Link, H } from './uiLib'

const AppHeader = observer(() => {
  const store = useStore()
  return (
    <>
      <div className="container grid grid-cols-3 gap-20 bg-slate-100 p-4">
        <Link href="/"><H.H1 className="text-lg">HOBBYR</H.H1></Link>
        <div className="text-center">
          {store.user ? (
            <Link href={'/user/' + store.user.urlSlug}>{store.user.email}</Link>
          ) : (
            ''
          )}
        </div>
        <div className="text-right">{store.user ? <LogoutButton /> : ''}</div>
      </div>
      <Divider className="my-0" />
    </>
  )
})

export default AppHeader
