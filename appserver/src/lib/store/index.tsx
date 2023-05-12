import { createContext, useContext, useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import Store from './store';


const StoreContext = createContext<Store | null>(null);

const StoreWrapper = ({ nextURL, children }:any) => {
  // this wrapper should only be present once, towards the top of the
  // application component component tree.
  const [store] = useState(() => new Store())
  useEffect(() => {
    store.boot(nextURL)
  },[store])
  return (
    <StoreContext.Provider value={store}>
      {children}
    </StoreContext.Provider>
  );
};

const useStore = () => {
  const store = useContext<Store | null>(StoreContext);
  if (!store) {
    throw new Error('useStore doesnt have the StoreContext');
  }
  return store;
};

const StoreReadinessWrapper = observer(({ ifNotReady, children }:any) => {
  const store = useStore();
  if (store.ready)
    return (
      <div data-testid="storeReady" data-auth-uid={store.user && store.user.id || ''}>
        {children}
      </div>
    );
  return <div data-testid="storeNotReady">{ifNotReady}</div>;
});

export { useStore, StoreWrapper, StoreReadinessWrapper };

