import { createContext, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import Store from './store';

const storeSingleton = new Store();
storeSingleton.boot();

const StoreContext = createContext<Store | null>(null);

const StoreWrapper = ({ children }:any) => {
  // this wrapper should only be present once, towards the top of the
  // application component component tree.
  return (
    <StoreContext.Provider value={storeSingleton}>
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
      <div data-testid="storeReady" data-auth-uid={store.user?.id || ''}>
        {children}
      </div>
    );
  return <div data-testid="storeNotReady">{ifNotReady}</div>;
});

export { useStore, StoreWrapper, StoreReadinessWrapper };

