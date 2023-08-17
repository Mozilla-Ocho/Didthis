/* eslint @typescript-eslint/ban-ts-comment: 0 */
// @ts-nocheck
// here be mock dragons
import { useState, ReactNode } from 'react'
import { useRouter } from 'next/router'
import { StoreContext } from '../../lib/store'
import Store from '../../lib/store/store'

export type StoreParams = ConstructorParameters<typeof Store>[0]

export const buildMockStore = (
  storeParams: StoreParams,
  storeOverrides: Partial<Store> = {}
) => {
  // note: can't use subclass - makeAutoObservable disallows it
  const store = new Store(storeParams)
  const storeProxy = new Proxy({}, {
    get(target, prop, receiver) {
      let object = null;
      if (prop in storeOverrides) {
        object = storeOverrides
      } if (prop in store) {
        object = store
      }
      if (object) {
        const found = object[prop]
        return typeof found == 'function' ? found.bind(this) : found
      }
    },
  })
  return storeProxy as Store
}

export type BaseMockStoreWrapperProps = Omit<StoreParams, 'router'> & {
  storeOverrides?: Partial<Store>
  buildStore: typeof buildMockStore
  children: ReactNode
}

export const BaseMockStoreWrapper = ({
  storeOverrides = {},
  buildStore = buildMockStore,
  children,
  ...storeParams
}: BaseMockStoreWrapperProps) => {
  const router = useRouter()
  const [store] = useState(() =>
    buildStore({ ...storeParams, router }, storeOverrides)
  )
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}
