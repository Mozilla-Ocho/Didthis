import { observer } from 'mobx-react-lite'
import { useStore } from '@/lib/store'
import { LogoutButton } from '@/components/auth/LogoutButton'
import { Divider, Link, H } from './uiLib'
// import pathBuilder from '@/lib/pathBuidler'

const AppHeader = observer(({ isHome }: { isHome?: boolean }) => {
  const store = useStore()
  if (store.user) {
    return (
      <div>
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
        <Divider className="m-0" />
      </div>
    )
  } else {
    return (
      <div>
        <div className="p-4 text-center">
          <span className="bg-yellow-300 pt-2 px-1 inline-block text-bxl mx-auto">
            <Link intent="logo" href="/">
              <H.HLogo>DABBLER</H.HLogo>
            </Link>
          </span>
        </div>
        <Divider className="m-0" />
      </div>
    )
  }
})

export default AppHeader
