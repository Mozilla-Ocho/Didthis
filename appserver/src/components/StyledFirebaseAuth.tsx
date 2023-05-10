import { useEffect, useRef, useState, useCallback } from 'react';

// {{ this is from https://github.com/firebase/firebaseui-web-react/pull/173#issuecomment-1151532176
// because the firebaseui react library is an unmaintained project that doesn't
// work under react strict mode and looks like it never will.
import { onAuthStateChanged } from 'firebase/auth';
// import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';

const StyledFirebaseAuth = ({
  uiConfig,
  firebaseAuth,
  className,
  uiCallback,
}) => {
  const [userSignedIn, setUserSignedIn] = useState(false);
  const [deregisterFn, setDeregisterFn] = useState(false);
  const elementRef = useRef(null);

  const loadFirebaseui = useCallback(async () => {
    // importing firebaseui implicitly assumes we are in browser context. in
    // nextjs, the code is executed also on the server, and this causes an
    // exception to be thrown. so we have to dynamically import the firebaseui
    // library in an async callback.
    const firebaseui = await import("firebaseui");
    const firebaseUiWidget =
      firebaseui.auth.AuthUI.getInstance() ||
      new firebaseui.auth.AuthUI(firebaseAuth);
    if (uiConfig.signInFlow === 'popup') firebaseUiWidget.reset();
    const unregisterAuthObserver = onAuthStateChanged(firebaseAuth, user => {
      if (!user && userSignedIn) firebaseUiWidget.reset();
      setUserSignedIn(!!user);
    });
    if (uiCallback) uiCallback(firebaseUiWidget);
    // @ts-ignore
    firebaseUiWidget.start(elementRef.current, uiConfig);
    setDeregisterFn(() => {
      // because we're in an async callback, deregistration functions require
      // jumping hoops. store it in a state value.
      unregisterAuthObserver();
      firebaseUiWidget.reset();
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  useEffect(() => {
    loadFirebaseui();
    return () => {
      deregisterFn && deregisterFn()
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div className={className} ref={elementRef} />;
};

export {StyledFirebaseAuth}

