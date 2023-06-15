import { action, makeAutoObservable } from 'mobx'
import apiClient from '@/lib/apiClient'
import log from '@/lib/log'
import { isEqual } from 'lodash-es'
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
// import * as amplitude from '@amplitude/analytics-browser';
import { trackingEvents } from '@/lib/trackingEvents'
import { useEffect } from 'react'
import {UrlMetaWrapper} from '../apiConstants'

type GeneralError = false | '_get_me_first_fail_' | '_api_fail_'
type LoginErrorMode = false | '_inactive_code_'

let moduleGlobalFirebaseInitialized = false

// XXX_PORTING review for non-singleton changes

class Store {
  user: false | ApiUser = false
  // we don't have a type for the firebase ref
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  firebaseRef: undefined | any = undefined
  signupCode: false | string = false
  trackedPageEvent: false | string = false
  generalError: GeneralError = false
  firebaseModalOpen = false
  loginButtonsSpinning = false
  loginErrorMode: LoginErrorMode = false
  fullpageLoading = false // used when signing in

  constructor({
    authUser,
    signupCode,
  }: {
    authUser?: ApiUser | false
    signupCode?: false | string
  }) {
    // nextjs SSR computes and provides the authUser and signup code via input
    // props to the wrapper/provider
    makeAutoObservable(
      this,
      {
        firebaseRef: false,
        trackedPageEvent: false,
      },
      { autoBind: true }
    )
    if (signupCode) this.setSignupCode(signupCode)
    if (authUser) this.setUser(authUser)
  }

  setSignupCode(code: string | false) {
    this.signupCode = code
  }

  // {{{ auth

  setFullPageLoading(x: boolean) {
    this.fullpageLoading = x
  }

  initFirebase() {
    let firebaseConfig
    if (moduleGlobalFirebaseInitialized) return
    moduleGlobalFirebaseInitialized = true

    // DRY_63816 firebase client config (not secret, but does depend on
    // environment)
    // TODO: better environment config handling. i don't yet have a way to set
    // a different env var in test vs prod react client since the js bundle is
    // built by the appserver_prod image, which is shared in both environments
    // so the test/prod bundles are currently identical. however, the
    // NEXT_PUBLIC_ENV_NAME var does give me a way to do this right here, for now.
    if (process.env.NEXT_PUBLIC_ENV_NAME === 'dev') {
      // note that webpack bundle optimization will remove these config chunks
      // from production bundles because the conditions will be
      // deterministically false to the transpiler.
      firebaseConfig = {
        apiKey: 'AIzaSyDKFg457lbVbAB_dcLXU-2foZkl96ayu6U',
        authDomain: 'moz-fx-future-products-nonprod.firebaseapp.com',
        projectId: 'moz-fx-future-products-nonprod',
        storageBucket: 'moz-fx-future-products-nonprod.appspot.com',
        messagingSenderId: '984891837435',
        appId: '1:984891837435:web:f6e3d55ffb1f35db5d995e',
      }
    }
    if (process.env.NEXT_PUBLIC_ENV_NAME === 'nonprod') {
      firebaseConfig = {
        apiKey: 'AIzaSyDKFg457lbVbAB_dcLXU-2foZkl96ayu6U',
        authDomain: 'moz-fx-future-products-nonprod.firebaseapp.com',
        projectId: 'moz-fx-future-products-nonprod',
        storageBucket: 'moz-fx-future-products-nonprod.appspot.com',
        messagingSenderId: '984891837435',
        appId: '1:984891837435:web:f6e3d55ffb1f35db5d995e',
      }
    }
    if (process.env.NEXT_PUBLIC_ENV_NAME === 'prod') {
      firebaseConfig = {
        // XXX_PORTING setup prod here
      }
    }

    if (firebaseConfig) firebase.initializeApp(firebaseConfig)
    this.firebaseRef = firebase

    // we disable client-side auth because we're using our own cookie session
    // auth instead.
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE)

    firebase.auth().onAuthStateChanged(
      // called after a sign in / sign up action from the user in the firebase
      // ui, and we want to generate a session cookie from it (and potentially
      // autovivify the user in the backend)
      firebaseUser => {
        if (firebaseUser) {
          log.auth('firebase user', firebaseUser)
          // and we can close the firebase ui container modal
          this.cancelGlobalLoginOverlay()
          // and switch to our own loading state
          this.setFullPageLoading(true)
          firebaseUser
            .getIdToken()
            .then(idToken => apiClient.sessionLogin({ idToken }))
            // the GET me call here needs the signup code because it will
            // actually auto-vivify the user and register the signup event in
            // amplitude, which we want to associated with the code.
            .then(() => apiClient.getMe({ signupCode: this.signupCode }))
            .then(wrapper => {
              log.readiness('acquired getMe user after firebase auth')
              this.setUser(wrapper.payload)
              this.trackEvent(trackingEvents.caLogin)
              this.setFullPageLoading(false)
            })
            .catch(e => {
              log.error('error acquiring user onAuthStateChanged', e)
              // this is what happens if the user is banned, or if there's a
              // network error on any of the critical api sequences.  better
              // error handling is important but for now, we will just force a
              // page reload.
              // TODO: better handling here.
              window.location.reload()
            })
        } else {
          this.cancelGlobalLoginOverlay()
          this.setFullPageLoading(false)
        }
      },
      error => {
        log.error(error)
        log.readiness('firebase auth error')
        this.cancelGlobalLoginOverlay()
        this.setFullPageLoading(false)
      }
    )
  }

  launchGlobalLoginOverlay(overrideCodeCheck: boolean) {
    this.trackEvent(trackingEvents.bcLoginSignup)
    this.loginErrorMode = false
    // DRY_47693 signup code logic
    if (overrideCodeCheck) {
      // when overrideCodeCheck is true, we found the signupCode was invalid
      // but presented the user with a "login with existing account" button.
      // if they do sign up this way, which is allowed via firebase, they end
      // up in the unsolicited state, same as if they used the signupCode=false
      // flow.
      this.firebaseModalOpen = true
      return
    }
    if (this.signupCode === false) {
      // with no code present, we don't show any special case ui, we just let
      // them sign in and if they sign up for a new account, they'll land on
      // an unsolicited user page.
      this.firebaseModalOpen = true
      return
    }
    this.loginButtonsSpinning = true
    apiClient
      .validateSignupCode({ code: this.signupCode || '' })
      .then(
        action(res => {
          this.loginButtonsSpinning = false
          if (res.payload.active) {
            this.firebaseModalOpen = true
          } else if (res.payload.active === false) {
            this.loginErrorMode = '_inactive_code_'
          }
        })
      )
      .catch(() => {
        this.setGeneralError('_api_fail_')
      })
  }

  cancelGlobalLoginOverlay() {
    this.firebaseModalOpen = false
    this.loginErrorMode = false
    this.loginButtonsSpinning = false
  }

  setUser(x: ApiUser | false) {
    log.auth('setuser', x)
    if (x) {
      log.auth('store acquired user', x)
      this.user = x
      // XXX_PORTING
      // amplitude.setUserId(x.id);
      // DRY_47693 signup code logic
      // if we have a signup code on the url, clear it
      if (this.signupCode) {
        log.location('removing signupCode from url')
        const url = new URL(window.location.toString())
        url.searchParams.delete('signupCode')
        // XXX_PORTING
        window.history.replaceState({}, '', url.toString())
        this.signupCode = false
      }
      if (x.signupCodeName) {
        // if the user has a signup code, make sure it's set in the amplitude user properties
        log.tracking('identify() signupCode')
        // XXX_PORTING
        // const identifyOps = new amplitude.Identify();
        // identifyOps.setOnce('signupCodeName', x.signupCodeName);
        // identifyOps.setOnce('hasSignupCode', '1');
        // amplitude.identify(identifyOps);
      }
    } else {
      log.auth('store clearing user')
    }
  }

  async logOut() {
    // we have to call the api to delete the cookie because it's httpOnly
    log.auth('store logOut')
    this.trackEvent(trackingEvents.bcLogout)
    return apiClient
      .sessionLogout()
      .then(() => {
        window.location.assign('/')
      })
      .catch(() => {
        this.setGeneralError('_api_fail_')
      })
  }

  // }}}

  trackEvent(evt: EventSpec, opts?: EventSpec['opts']) {
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

  setTrackedPageEvent(evt: EventSpec, opts?: EventSpec['opts']) {
    const key = evt.key
    const fullEvent = JSON.parse(JSON.stringify(trackingEvents[key]))
    if (!fullEvent) {
      log.error(`tracked event is not in trackingEvents (${evt})`)
      return
    }
    fullEvent.opts = { ...fullEvent.opts, opts }
    if (!fullEvent.opts.name || fullEvent.eventName !== 'pageview') {
      log.error(
        `tracking a page event requires a pageview-like spec (${JSON.stringify(
          fullEvent
        )})`
      )
      return
    }
    if (!isEqual(fullEvent, this.trackedPageEvent)) {
      this.trackEvent(evt, opts)
    }
    this.trackedPageEvent = fullEvent
  }

  useTrackedPageEvent = (evt: EventSpec, opts?: EventSpec['opts']) => {
    // react complains if i call useEffect as an object method. it has to be a
    // pure function. and you can't use 'this' in the dependency array. also,
    // eslint complains if i'm assinging this to a var, we have competing
    // style/linting errors here.
    /* eslint-disable @typescript-eslint/no-this-alias */
    const self = this
    return useEffect(() => {
      self.setTrackedPageEvent(evt, opts)
    }, [self, evt, opts])
    /* eslint-enable @typescript-eslint/no-this-alias */
  }

  setGeneralError = (errId: GeneralError) => {
    this.generalError = errId
  }

  clearGeneralError = () => {
    this.generalError = false
  }

  async savePost(post: ApiPost): Promise<ApiPost> {
    if (!this.user) throw new Error('must be authed')
    return apiClient.newPost({ post }).then(wrapper => {
      this.setUser(wrapper.payload.user)
      if (post.projectId === 'new') {
        this.trackEvent(trackingEvents.caNewPostNewProj)
      } else {
        this.trackEvent(trackingEvents.caNewPost)
      }
      return wrapper.payload.post
    })
  }

  async saveProject(project: ApiProject): Promise<ApiProject> {
    if (!this.user) throw new Error('must be authed')
    return apiClient.saveProject({ project }).then(wrapper => {
      this.setUser(wrapper.payload.user)
      this.trackEvent(trackingEvents.caNewProject)
      return wrapper.payload.project
    })
  }

}

export default Store
