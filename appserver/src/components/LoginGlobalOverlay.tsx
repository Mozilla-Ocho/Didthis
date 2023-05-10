import { Button } from "@/components/uiLib";
import { observer } from "mobx-react-lite";
import log from "@/lib/log";
import { useStore } from "@/lib/store";
import { StyledFirebaseAuth } from "@/components/StyledFirebaseAuth";

const LoginGlobalOverlay = observer(() => {
  const store = useStore();

  const firebaseUiConfig = {
    signInFlow: "popup",
    signInOptions: [
      {
        provider: store.firebaseRef.auth.EmailAuthProvider.PROVIDER_ID,
        requireDisplayName: false,
      },
    ],
    callbacks: {
      signInSuccessWithAuthResult: (authResult) => {
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
      signInFailure: (error) => {
        log.auth("signInFailure", error);
        store.cancelGlobalLoginOverlay();
        return false;
      },
    },
  };

  // XXX_PORTING i deleted the confirmation modals for now
  if (store.firebaseModalOpen) {
    return (
      <div>
        <StyledFirebaseAuth
          uiConfig={firebaseUiConfig}
          firebaseAuth={store.firebaseRef.auth()}
        />
      </div>
    );
  } else {
    return false;
  }
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
