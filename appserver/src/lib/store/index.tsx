import { createContext, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import Store from './store.ts';

const storeSingleton = new Store();
storeSingleton.boot();

const StoreContext = createContext();

const StoreWrapper = ({ children }) => {
  // this wrapper should only be present once, towards the top of the
  // application component component tree.
  return (
    <StoreContext.Provider value={storeSingleton}>
      {children}
    </StoreContext.Provider>
  );
};

const useStore = () => {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error('useStore doesnt have the StoreContext');
  }
  return store;
};

const StoreReadinessWrapper = observer(({ ifNotReady, children }) => {
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

