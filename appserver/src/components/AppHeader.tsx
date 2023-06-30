import { observer } from 'mobx-react-lite'
import { useStore } from '@/lib/store'
import { LogoutButton } from '@/components/auth/LogoutButton'
import { Divider, Link, PagePad } from './uiLib'
import branding from '@/lib/branding'

const AppHeader = observer(() => {
  const store = useStore()
  if (store.user) {
    return (
      <div>
        <PagePad wide noPadY>
          <div className="flex items-baseline py-4">
            <div className="bg-yellow-300 pt-2 px-1 inline-block text-xl">
              <Link intent="logo" href="/">
                <h1 className="text-3xl leading-none">{branding.productName.toUpperCase()}</h1>
              </Link>
            </div>
            <div className="text-right text-sm flex-grow">
              {store.user ? <LogoutButton intent="headerNav" /> : ''}
            </div>
          </div>
        </PagePad>
        <Divider className="m-0" />
      </div>
    )
  } else {
    return (
      <div>
        <PagePad wide noPadY>
          <div className="py-4 text-center">
            <span className="bg-yellow-300 pt-2 px-1 inline-block text-xl mx-auto">
              <Link intent="logo" href="/">
                <h1 className="text-3xl leading-none">{branding.productName.toUpperCase()}</h1>
              </Link>
            </span>
          </div>
        </PagePad>
        <Divider className="m-0" />
      </div>
    )
  }
})

export default AppHeader
