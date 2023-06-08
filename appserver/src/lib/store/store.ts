import { action, makeAutoObservable } from "mobx";
import apiClient from "@/lib/apiClient";
import log from "@/lib/log";
// import profileUtils from "../profileUtils";
import { isEqual } from "lodash-es";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { clientAppPaths } from "@/lib/clientAppPaths";
// import * as amplitude from '@amplitude/analytics-browser';
import { trackingEvents } from "@/lib/trackingEvents";
import { useEffect } from "react";

type GeneralError = false | "_get_me_first_fail_" | "_api_fail_";
type LoginErrorMode = false | "_inactive_code_" | "_code_error_";

let moduleGlobalFirebaseInitialized = false;

// XXX_PORTING review for non-singleton changes

class Store {
  showAuthComponents = false; // see clearUserBits() for explanation
  user: false | ApiUser = false;
  savingProfile = false; // for showing a spinner / tmp disabling forms
  slugValidationError: false | string = false;
  editingSlug = "";
  suggestedSlug = "";
  urlMetaProcessor = "unfurl";
  firebaseRef: undefined | any = undefined;
  signupCode: false | string = false;
  trackedPageEvent: false | string = false;
  clickedConfirmBasics = false;
  suppressBasicsBarOnTimer = false;
  generalError: GeneralError = false;
  firebaseModalOpen = false;
  loginButtonsSpinning = false;
  loginErrorMode: LoginErrorMode = false;
  fullpageLoading: boolean = false; // used when signing in

  constructor({authUser, signupCode}:{authUser?:ApiUser | false, signupCode?: false | string}) {
    makeAutoObservable(
      this,
      {
        firebaseRef: false,
        trackedPageEvent: false,
      },
      { autoBind: true }
    );
    if (signupCode) this.setSignupCode(signupCode)
    if (authUser) this.setUser(authUser)
  }

  setSignupCode(code: string | false) {
    this.signupCode = code
  }

  // {{{ urls

  userHomepageUrlForSlug(slug: string) {
    return clientAppPaths.userHomepageUrlForSlug(slug);
  }

  get userHomepageUrl() {
    // this getter also returns the url and also proxies as truthy for when the
    // profile is live, for example:
    // if (store.userHomepageUrl) { assumes a live page } else { profile not
    // complete enough }
    if (!this.user) return undefined;
    if (!this.user.urlSlug) return undefined;
    return this.userHomepageUrlForSlug(this.user.urlSlug);
  }

  get profileIsMinimallyComplete() {
    return !!this.userHomepageUrl;
  }

  // }}}

  // {{{ healthCheck

  getHealthCheck() {
    return apiClient.getHealthCheck();
  }

  // }}}

  // {{{ auth

  setFullPageLoading(x: boolean) {
    this.fullpageLoading = x
  }

  initFirebase() {
    const self = this;
    let firebaseConfig;
    if (moduleGlobalFirebaseInitialized) return;
    moduleGlobalFirebaseInitialized = true;

    // DRY_63816 firebase client config (not secret, but does depend on
    // environment)
    // TODO: better environment config handling. i don't yet have a way to set
    // a different env var in test vs prod react client since the js bundle is
    // built by the appserver_prod image, which is shared in both environments
    // so the test/prod bundles are currently identical. however, the
    // NEXT_PUBLIC_ENV_NAME var does give me a way to do this right here, for now.
    if (process.env.NEXT_PUBLIC_ENV_NAME === "dev") {
      // note that webpack bundle optimization will remove these config chunks
      // from production bundles because the conditions will be
      // deterministically false to the transpiler.
      firebaseConfig = {
        apiKey: "AIzaSyDKFg457lbVbAB_dcLXU-2foZkl96ayu6U",
        authDomain: "moz-fx-future-products-nonprod.firebaseapp.com",
        projectId: "moz-fx-future-products-nonprod",
        storageBucket: "moz-fx-future-products-nonprod.appspot.com",
        messagingSenderId: "984891837435",
        appId: "1:984891837435:web:f6e3d55ffb1f35db5d995e"
      };
    }
    if (process.env.NEXT_PUBLIC_ENV_NAME === "nonprod") {
      firebaseConfig = {
        apiKey: "AIzaSyDKFg457lbVbAB_dcLXU-2foZkl96ayu6U",
        authDomain: "moz-fx-future-products-nonprod.firebaseapp.com",
        projectId: "moz-fx-future-products-nonprod",
        storageBucket: "moz-fx-future-products-nonprod.appspot.com",
        messagingSenderId: "984891837435",
        appId: "1:984891837435:web:f6e3d55ffb1f35db5d995e"
      };
    }
    if (process.env.NEXT_PUBLIC_ENV_NAME === "prod") {
      firebaseConfig = {
        // XXX_PORTING setup prod here
      };
    }

    if (firebaseConfig) firebase.initializeApp(firebaseConfig);
    self.firebaseRef = firebase;

    // we disable client-side auth because we're using our own cookie session
    // auth instead.
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);

    firebase.auth().onAuthStateChanged(
      // called after a sign in / sign up action from the user in the firebase
      // ui, and we want to generate a session cookie from it (and potentially
      // autovivify the user in the backend)
      function (firebaseUser) {
        if (firebaseUser) {
          log.auth("firebase user", firebaseUser);
          // and we can close the firebase ui container modal
          self.cancelGlobalLoginOverlay();
          // and switch to our own loading state
          self.setFullPageLoading(true)
          firebaseUser
            .getIdToken()
            .then((idToken) => apiClient.sessionLogin({ idToken }))
            // the GET me call here needs the signup code because it will
            // actually auto-vivify the user and register the signup event in
            // amplitude, which we want to associated with the code.
            .then(() =>
              apiClient.getMe({ signupCode: self.signupCode })
            )
            .then((wrapper) => {
              log.readiness("acquired getMe user after firebase auth");
              self.setUser(wrapper.payload);
              self.trackEvent(trackingEvents.caLogin);
              self.setFullPageLoading(false)
            })
            .catch((e) => {
              log.error("error acquiring user onAuthStateChanged", e);
              // this is what happens if the user is banned, or if there's a
              // network error on any of the critical api sequences.  better
              // error handling is important but for now, we will just force a
              // page reload.
              // TODO: better handling here.
              window.location.reload();
            });
        } else {
          self.cancelGlobalLoginOverlay();
          self.setFullPageLoading(false)
        }
      },
      function (error) {
        log.error(error);
        log.readiness("firebase auth error");
        self.cancelGlobalLoginOverlay();
        self.setFullPageLoading(false)
      }
    );
  }

  launchGlobalLoginOverlay(overrideCodeCheck: boolean) {
    this.trackEvent(trackingEvents.bcLoginSignup);
    this.loginErrorMode = false;
    // DRY_47693 signup code logic
    if (overrideCodeCheck) {
      // when overrideCodeCheck is true, we found the signupCode was invalid
      // but presented the user with a "login with existing account" button.
      // if they do sign up this way, which is allowed via firebase, they end
      // up in the unsolicited state, same as if they used the signupCode=false
      // flow.
      this.firebaseModalOpen = true;
      return;
    }
    if (this.signupCode === false) {
      // with no code present, we don't show any special case ui, we just let
      // them sign in and if they sign up for a new account, they'll land on
      // an unsolicited user page.
      this.firebaseModalOpen = true;
      return;
    }
    this.loginButtonsSpinning = true;
    apiClient
      .validateSignupCode({ code: this.signupCode || "" })
      .then(
        action((res) => {
          this.loginButtonsSpinning = false;
          if (res.payload.active) {
            this.firebaseModalOpen = true;
          } else if (res.payload.active === false) {
            this.loginErrorMode = "_inactive_code_";
          }
        })
      )
      .catch(() => {
        this.setGeneralError("_api_fail_");
      });
  }

  cancelGlobalLoginOverlay() {
    this.firebaseModalOpen = false;
    this.loginErrorMode = false;
    this.loginButtonsSpinning = false;
  }

  setUser(x: ApiUser | false) {
    log.auth("setuser", x);
    if (x) {
      log.auth("store acquired user", x);
      // @ts-ignore
      // XXX_PORTING
      // window.fullResetForTestUser = async (confirm) => {
      //   // test runners call this to reset test user profiles
      //   if (confirm !== "confirm") throw new Error('arg must be "confirm"');
      //   let user = await apiClient.postUserProfile({
      //     fullResetForTestUser: confirm,
      //   });
      //   this.ingestUpdatedUser(user);
      //   user = await apiClient.postUrlSlug({ fullResetForTestUser: confirm });
      //   this.ingestUpdatedUser(user);
      // };
      this.ingestUpdatedUser(x);
      // XXX_PORTING
      // amplitude.setUserId(x.id);
      this.showAuthComponents = true;
      // DRY_47693 signup code logic
      // if we have a signup code on the url, clear it
      if (this.signupCode) {
        log.location("removing signupCode from url");
        const url = new URL(window.location.toString());
        url.searchParams.delete("signupCode");
        // XXX_PORTING
        //window.history.replaceState({}, '', url.toString());
        this.signupCode = false;
      }
      // XXX_PORTING
      // if (x.signupCodeName) {
      //   // if the user has a signup code, make sure it's set in the amplitude user properties
      //   log.tracking('identify() signupCode');
      //   const identifyOps = new amplitude.Identify();
      //   identifyOps.setOnce('signupCodeName', x.signupCodeName);
      //   identifyOps.setOnce('hasSignupCode', '1');
      //   amplitude.identify(identifyOps);
      // }
    } else {
      log.auth("store clearing user");
      this.showAuthComponents = false;
      setTimeout(() => this.clearUserBits(), 1);
    }
  }

  logOut() {
    // we have to call the api to delete the cookie because it's httpOnly
    log.auth("store logOut");
    this.trackEvent(trackingEvents.bcLogout);
    return apiClient
      .sessionLogout()
      .then(() => {
        // this.setUser(false); // avoid ux flash, the new page load handles state reset
        // XXX_PORTING
        // amplitude.reset(); // clears amplitude ids
        window.location.assign(clientAppPaths.afterLogout);
      })
      .catch((e) => {
        this.setGeneralError("_api_fail_");
      });
  }

  clearUserBits() {
    // the showAuthComponents boolean is used to conditionally render the
    // authenticated part of the application. on logout, it gets set false
    // first and then after a timeout the user bits are removed. that way mobx
    // doesn't cause errors by re-rendering authenticated components before the
    // top level branch component that woud remove them is re-rendered.
    this.user = false;
    this.editingSlug = "";
    this.suggestedSlug = "";
  }

  // }}}

  ingestUpdatedUser(user: any) {
    this.user = user;
    this.editingSlug = user.urlSlug || this.suggestedSlug || "";
    this.suggestedSlug = "";
    //XXX_PORTING
    //this.fetchSlugSuggestionIfNeeded();
  }

  // XXX_PORTING
  // saveProfileChanges() {
  //   if (!this.user)
  //     throw new Error("updateProfile called without having an auth user");
  //   // TODO: what if savingProfile is already true? it's mostly avoided
  //   // by disabling the save button while saving, but what else might
  //   this.savingProfile = true;
  //   const wasIncomplete = !this.profileIsMinimallyComplete;
  //   return apiClient
  //     .postUserProfile({
  //       userProfile: this.editingUserProfile,
  //     })
  //     .then(
  //       action((user) => {
  //         this.ingestUpdatedUser(user);
  //         this.savingProfile = false;
  //         if (wasIncomplete && this.profileIsMinimallyComplete) {
  //           this.trackEvent(trackingEvents.caProfileBasicsAll);
  //         }
  //         return this.userProfile;
  //       })
  //     )
  //     .catch(
  //       action((e) => {
  //         this.savingProfile = false;
  //         this.setGeneralError("_api_fail_");
  //         this.trackEvent(trackingEvents.apiError, { action: "profileSave" });
  //         throw e;
  //       })
  //     );
  // }

  // XXX_PORTING
  // fetchSlugSuggestionIfNeeded() {
  //   if (this.user && !this.user.urlSlug && !this.user.unsolicited) {
  //     // they don't have a slug yet. fetch the current/best suggested slug from
  //     // the API when the user loads and/or they update their profile.
  //     apiClient
  //       .getUrlSlug({ checkSlug: "" })
  //       .then((payload) => {
  //         if (payload.suggestedSlug) {
  //           this.suggestedSlug = payload.suggestedSlug;
  //           this.editingSlug = payload.suggestedSlug;
  //         }
  //       })
  //       .catch(() => {});
  //   }
  // }

  setEditingSlug(x: string) {
    this.editingSlug = x;
  }

  saveUrlSlug() {
    return apiClient
      .postUrlSlug({
        slug: this.editingSlug,
      })
      .then(
        action((user) => {
          this.ingestUpdatedUser(user);
          this.slugValidationError = false;
          return user
        })
      )
      .catch((e) => {
        // slug unavailability or validation errors are common error cases
        // here.
        if (e.apiInfo?.responseWrapper?.status === 400) {
          this.slugValidationError = e.apiInfo.errorMsg;
        } else {
          this.slugValidationError = false;
          this.setGeneralError("_api_fail_");
        }
        throw e;
      });
  }

  setUrlMetaProcessor(x: string) {
    this.urlMetaProcessor = x;
  }

  getUrlMeta(url: string) {
    return apiClient.getUrlMeta({
      url,
      processor: this.urlMetaProcessor,
    });
  }

  rawUnfurl(url: string) {
    return apiClient.rawUnfurl({ url });
  }

  setClickedConfirmBasics() {
    // also see ingestUpdatedUser which sets this true automatically if the
    // user has one or more projects so the step logic doesn't revert
    // on a page reload.
    this.clickedConfirmBasics = true;
    // when the user clicks the button to collapse the basics editor, we also
    // then show a new bar below the header where they can reopen it. however
    // we want that bar to slide in AFTER the basics area has finished
    // animating, otherwise they're both moving at the same time, it's busy,
    // and you can't really tell the bar is newly presented.
    this.suppressBasicsBarOnTimer = true;
    this.trackEvent(trackingEvents.bcBasicsGetStarted);
    setTimeout(
      action(() => {
        this.suppressBasicsBarOnTimer = false;
      }),
      700
    );
  }

  postWaitlist({
    email,
    landing_page,
  }: {
    email: string;
    landing_page: string;
  }) {
    return apiClient.postWaitlist({ email, landing_page });
  }

  trackEvent(evt: any, opts?: any) {
    // XXX_PORTING
    // const key = evt.key;
    // const fullEvent = JSON.parse(JSON.stringify(trackingEvents[key]));
    // if (!fullEvent) {
    //   log.error(`tracked event is not in trackingEvents (${evt})`);
    //   return;
    // }
    // fullEvent.opts = { ...fullEvent.opts, ...opts };
    // fullEvent.opts.isAuthed = this.user ? 'y' : 'n';
    // log.tracking(fullEvent.eventName, fullEvent.opts.name, JSON.stringify(fullEvent));
    // amplitude.track(fullEvent.eventName, fullEvent.opts);
  }

  setTrackedPageEvent(evt: any, opts?: any) {
    const key = evt.key;
    // @ts-ignore
    const fullEvent = JSON.parse(JSON.stringify(trackingEvents[key]));
    if (!fullEvent) {
      log.error(`tracked event is not in trackingEvents (${evt})`);
      return;
    }
    fullEvent.opts = { ...fullEvent.opts, opts };
    if (!fullEvent.opts.name || fullEvent.eventName !== "pageview") {
      log.error(
        `tracking a page event requires a pageview-like spec (${JSON.stringify(
          fullEvent
        )})`
      );
      return;
    }
    if (!isEqual(fullEvent, this.trackedPageEvent)) {
      this.trackEvent(evt, opts);
    }
    this.trackedPageEvent = fullEvent;
  }

  useTrackedPageEvent = (evt: any, opts?: any) => {
    // react complains if i call useEffect as an object method. it has to be a
    // pure function. and you can't use 'this' in the dependency array.
    const self = this;
    return useEffect(() => {
      self.setTrackedPageEvent(evt, opts);
    }, [self, evt, opts]);
  };

  setGeneralError = (errId: GeneralError) => {
    this.generalError = errId;
  };

  clearGeneralError = () => {
    this.generalError = false;
  };
}

export default Store;
