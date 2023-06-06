import { useEffect } from "react";
// import { Button } from "@/components/uiLib";
import { observer } from "mobx-react-lite";
import log from "@/lib/log";
import { useStore } from "@/lib/store";
import { StyledFirebaseAuth } from "@/components/StyledFirebaseAuth";

// XXX_SKELETON
const LoginGlobalOverlay = observer(() => {
  const store = useStore();
  useEffect(() => {
    // client only, not on server
    store.initFirebase()
  })

  // XXX_PORTING i deleted the confirmation modals for now

  if (store.firebaseModalOpen) {
    // note the store loads firebase async, so this is inside the
    // firebaseModalOpen condition, outside this it could fail w/ uninitialized
    // firebase instance.
    const firebaseUiConfig = {
      signInFlow: "popup",
      signInOptions: [
        {
          provider: store.firebaseRef.auth.EmailAuthProvider.PROVIDER_ID,
          requireDisplayName: false,
        },
      ],
      callbacks: {
        signInSuccessWithAuthResult: (authResult:any) => {
          // note that the logic to handle the new auth state is in the store, on
          // the onAuthStateChanged callback, here all we do is show a spinner
          // until the store finishes.
          // TODO: this is optimistic thinking, we show a spinner until we assume
          // the store finishes acquiring auth, but if there's an error in that
          // process, this would just spin forever. the store currently forces
          // a page reload on an error during this process, so that's a bad
          // hack.
          log.auth("signInSuccessWithAuthResult", authResult);
          return false;
        },
        signInFailure: (error:any) => {
          log.auth("signInFailure", error);
          store.cancelGlobalLoginOverlay();
          return false;
        },
      },
    };

    return (
      <div>
        <StyledFirebaseAuth
          uiConfig={firebaseUiConfig}
          firebaseAuth={store.firebaseRef.auth()}
        />
      </div>
    );
  }
  return <></>;
  // return (
  //   <>
  //     <Modal
  //       title={'Log in or Sign up'}
  //       hideTitle
  //       noPad
  //       open={store.firebaseModalOpen}
  //       onClose={store.cancelGlobalLoginOverlay}
  //     >
  //     </Modal>
  //   </>
  // );
});

export { LoginGlobalOverlay };
