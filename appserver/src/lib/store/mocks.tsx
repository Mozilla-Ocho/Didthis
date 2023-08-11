import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import { useRouter } from 'next/router'
import { StoreContext } from '.'
import Store from './store'

// note: can't use subclass - makeAutoObservable disallows it
// export class MockStore extends Store {}

export const MockStoreWrapper = ({ children }: { children: ReactNode }) => {
  const router = useRouter()

  // this wrapper should only be present once, towards the top of the
  // application component component tree.
  const [store] = useState(() => {
    const store = new Store({ authUser: false, signupCodeInfo: false, router })

    // todo: monkeypatch whatever needs mocking in store

    return store
  })
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}
