import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from 'react'
import { observer } from 'mobx-react-lite'
import Store from './store'
import { NextRouter } from 'next/router'
import Loading from '@/components/pages/Loading'

const StoreContext = createContext<Store | null>(null)

const StoreWrapper = ({
  authUser,
  signupCode,
  children,
  router,
}: {
  authUser: ApiUser | false
  signupCode: false | string
  children: ReactNode
  router: NextRouter
}) => {
  // this wrapper should only be present once, towards the top of the
  // application component component tree.
  const [store] = useState(() => new Store({ authUser, signupCode, router }))
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

const useStore = () => {
  const store = useContext<Store | null>(StoreContext)
  if (!store) {
    throw new Error('useStore doesnt have the StoreContext')
  }
  return store
}

const StoreLoadingWrapper = observer(
  ({ children }: { children: ReactNode }) => {
    const store = useStore()
    if (store.fullpageLoading)
      return (
        <div data-testid="fullPageLoading">
          <Loading />
        </div>
      )
    return (
      <div
        data-testid="storeReady"
        data-auth-uid={(store.user && store.user.id) || ''}
      >
        {children}
      </div>
    )
  }
)

export { useStore, StoreWrapper, StoreLoadingWrapper }
