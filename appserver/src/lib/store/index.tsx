import { createContext, useContext, useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import Store from "./store";

const StoreContext = createContext<Store | null>(null);

const StoreWrapper = ({
  user,
  signupCode,
  children,
}: {
  user: ApiUser | false;
  signupCode: false | string;
  children: any;
}) => {
  // this wrapper should only be present once, towards the top of the
  // application component component tree.
  const [store] = useState(() => new Store({ user, signupCode }));
  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};

const useStore = () => {
  const store = useContext<Store | null>(StoreContext);
  if (!store) {
    throw new Error("useStore doesnt have the StoreContext");
  }
  return store;
};

const StoreLoadingWrapper = observer(({ ifLoading, children }: any) => {
  const store = useStore();
  // XXX_PRETTY full page loading mode
  if (store.fullpageLoading)
    return <div data-testid="fullPageLoading">{ifLoading}</div>;
  return (
    <div
      data-testid="storeReady"
      data-auth-uid={(store.user && store.user.id) || ""}
    >
      {children}
    </div>
  );
});

export { useStore, StoreWrapper, StoreLoadingWrapper };
