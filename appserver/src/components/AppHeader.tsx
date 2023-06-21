import { observer } from 'mobx-react-lite'
import { useStore } from '@/lib/store'
import { LogoutButton } from '@/components/auth/LogoutButton'
import { Divider, Link, H } from './uiLib'
// import pathBuilder from '@/lib/pathBuidler'

const AppHeader = observer(() => {
  const store = useStore()
  if (store.user) {
    return (
      <>
        <div className="flex items-baseline p-4">
          <div className="bg-yellow-300 pt-2 px-1 inline-block text-bxl">
            <Link intent="logo" href="/">
              <H.HLogo>DABBLER</H.HLogo>
            </Link>
          </div>
          <div className="text-right text-bs flex-grow">
            {store.user ? <LogoutButton intent="headerNav" /> : ''}
          </div>
        </div>
        <Divider className="my-0" />
      </>
    )
  } else {
    return (
      <>
        <div className="container grid grid-cols-1 gap-0 p-4">
          <Link href="/">
            <H.H1>HOBBYR</H.H1>
          </Link>
        </div>
        <Divider className="my-0" />
      </>
    )
  }
})

export default AppHeader
