import { useState, ReactNode } from 'react'
import { useRouter } from 'next/router'
import { StoreContext } from '../../lib/store'
import Store from '../../lib/store/store'

export type StoreParams = ConstructorParameters<typeof Store>[0]

// note: can't use subclass - makeAutoObservable disallows it
export const buildMockStore = (
  storeParams: StoreParams,
  storeOverrides: Partial<Store> = {}
) =>
  ({
    ...new Store(storeParams),
    ...storeOverrides,
  } as Store)

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
