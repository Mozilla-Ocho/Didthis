import { makeAutoObservable, toJS } from 'mobx'
import apiClientBase from '@/lib/apiClient'
import { amplitudeProxyEndpoint } from '@/lib/apiCore'
import log from '@/lib/log'
import { isEqual } from 'lodash-es'
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import * as amplitudeBase from '@amplitude/analytics-browser'
import { trackingEvents } from '@/lib/trackingEvents'
import { useEffect } from 'react'
import { NextRouter } from 'next/router'
import pathBuilder from '../pathBuilder'
import profileUtils from '../profileUtils'
import { AppleAuthenticationCredential } from '../appleAuth'
import AppShellAPI from '../appShellContent/api'
// import { UrlMetaWrapper } from '../apiConstants'

type GeneralError = false | '_get_me_first_fail_' | '_api_fail_'
type LoginErrorMode = false | '_inactive_code_'

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
let moduleGlobalFirebaseRef: any | false = false

// DRY_62447 modal transition time
const modalTransitionTime = 200

// XXX_PORTING review for non-singleton changes

export const KEY_SIGNUP_CODE_INFO = 'signupCodeInfo'
export const KEY_TRIAL_ACCOUNT_CLAIMED = 'trialAccountClaimed'

export type ApiClient = typeof apiClientBase
export type AmplitudeClient = typeof amplitudeBase

export type ConfirmingDelete =
  | { kind: 'account'; thing: ApiUser; deleting: boolean }
  | { kind: 'post'; thing: ApiPost; deleting: boolean }
  | { kind: 'project'; thing: ApiProject; deleting: boolean }

type UserListenerFn = (user: ApiUser) => void

class Store {
  user: false | ApiUser = false
  // we don't have a type for the firebase ref
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  firebaseRefNonReactive: undefined | any = undefined // nonreactive
  hasFirebaseRef = false // reactive
  signupCodeInfo: false | ApiSignupCodeInfo = false
  trackedPageEvent: false | EventSpec = false
  generalError: GeneralError = false
  firebaseModalOpen = false
  loginErrorMode: LoginErrorMode = false
  fullpageLoading = false // used when signing in
  confirmingDelete: ConfirmingDelete | false = false
  showConfirmDeleteModal = false
  router: NextRouter
  debugObjId = (Math.random() + '').replace('0.', '')
  testBucket: TestBucket | undefined
  apiClient: ApiClient
  amplitude: AmplitudeClient
  trialAccountClaimed?: boolean
  userListeners : Array<UserListenerFn> = []
  appShellApiRef: AppShellAPI | false = false

  constructor({
    authUser,
    signupCodeInfo,
    router,
    testBucket,
    apiClient = apiClientBase,
    amplitude = amplitudeBase,
  }: {
    authUser?: ApiUser | false
    signupCodeInfo?: false | ApiSignupCodeInfo
    router: NextRouter
    // bucketed tests are not in use everywhere so this is undefined in a bunch
    // of pages.
    testBucket?: TestBucket
    apiClient?: ApiClient
    amplitude?: AmplitudeClient
  }) {
    this.router = router
    this.testBucket = testBucket
    this.apiClient = apiClient
    this.amplitude = amplitude
    log.readiness('testBucket', testBucket)
    // nextjs SSR computes and provides the authUser and signup code via input
    // props to the wrapper/provider
    makeAutoObservable(
      this,
      {
        firebaseRefNonReactive: false,
        trackedPageEvent: false,
        router: false,
        userListeners: false,
        appShellApiRef: false,
      },
      { autoBind: true }
    )
    if (signupCodeInfo) this.setSignupCodeInfo(signupCodeInfo)
    if (authUser) this.setUser(authUser)
    if (typeof window !== 'undefined') {
      this.amplitude.init(
        process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY as string,
        '',
        {
          serverUrl: amplitudeProxyEndpoint,
          defaultTracking: {
            pageViews: false,
            sessions: true,
            formInteractions: false,
          },
        }
      )
      const pt = window.localStorage.getItem('pendingTrack')
      // in addition to specific login or signup events, its useful in
      // ampltidue to have a meta event that flags this session as
      // authenticated so we can easily report on auth vs unauth session
      // activity.
      if (pt === 'signup') {
        // DRY_25748 signup tracking
        this.trackEvent(trackingEvents.caSignup, {
          signupCodeName: authUser ? authUser.signupCodeName : undefined,
        })
        this.trackEvent(trackingEvents.authSession, {
          signupCodeName: authUser ? authUser.signupCodeName : undefined,
        })
        this.setAmplitudeUserAttrs()
        window.localStorage.removeItem('pendingTrack')
      }
      if (pt === 'login') {
        this.trackEvent(trackingEvents.caLogin)
        this.trackEvent(trackingEvents.authSession, {
          signupCodeName: authUser ? authUser.signupCodeName : undefined,
        })
        this.setAmplitudeUserAttrs()
        window.localStorage.removeItem('pendingTrack')
      }
    }
    log.debug('store constructed. id=', this.debugObjId)
  }

  setSignupCodeInfo(info: ApiSignupCodeInfo | false) {
    this.signupCodeInfo = info
    if (info && typeof window !== 'undefined') {
      let replace = true
      try {
        const json = window.sessionStorage.getItem(KEY_SIGNUP_CODE_INFO)
        if (json) {
          const existing = JSON.parse(json) as ApiSignupCodeInfo
          if (existing && info.name === 'opendoor') {
            // in the event there is an existing code in localstorage, and the
            // current code is the default 'opendoor', don't replace the
            // existing value.
            replace = false
          }
        }
      } catch (e) {}
      if (replace) {
        window.sessionStorage.setItem(
          KEY_SIGNUP_CODE_INFO,
          JSON.stringify(toJS(this.signupCodeInfo))
        )
      }
    }
  }

  loadSignupInfoFromSessionStorage() {
    // called on useeffect so as not to break SSR
    if (typeof window !== 'undefined') {
      try {
        const json = window.sessionStorage.getItem(KEY_SIGNUP_CODE_INFO)
        if (json) {
          const info = JSON.parse(json) as ApiSignupCodeInfo
          if (!this.signupCodeInfo || this.signupCodeInfo.name === 'opendoor') {
            this.signupCodeInfo = info
          }
        }
      } catch (e) {}
    }
  }

  // {{{ auth

  // resetBlankSlateIfNewUser() {
  //   // very approximately detect if the user is new, and clear the blank state
  //   // localstorage. really meant for local testing w/ multiple users.
  //   if (this.user && typeof window !== 'undefined') {
  //     const now = new Date().getTime()
  //     const age = (now - this.user.createdAt)
  //     if (age < 1000 * 60 * 5) {
  //       window.localStorage.removeItem('skipBlankSlate') // DRY_26502
  //     }
  //   }
  // }

  setFullPageLoading(x: boolean) {
    this.fullpageLoading = x
  }

  initFirebase() {
    let firebaseConfig
    if (moduleGlobalFirebaseRef) {
      // log.debug('skipping firebase init, already done')
      if (!this.firebaseRefNonReactive) {
        this.firebaseRefNonReactive = moduleGlobalFirebaseRef
        this.hasFirebaseRef = true
      }
      return
    }
    log.debug('initializing firebase')

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
        apiKey: 'AIzaSyCBrJmCmx2HA2Q70m5P6oS4XGPGb9z9xBo',
        authDomain: 'moz-fx-future-products-prod.firebaseapp.com',
        projectId: 'moz-fx-future-products-prod',
        storageBucket: 'moz-fx-future-products-prod.appspot.com',
        messagingSenderId: '29393258446',
        appId: '1:29393258446:web:d65749a402414d9e140d9f',
        measurementId: 'G-SN8CNC7RYJ',
      }
    }

    if (firebaseConfig) firebase.initializeApp(firebaseConfig)
    this.firebaseRefNonReactive = firebase
    moduleGlobalFirebaseRef = firebase
    this.hasFirebaseRef = true

    // we disable client-side auth because we're using our own cookie session
    // auth instead.
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE)

    firebase
      .auth()
      .onAuthStateChanged(
        this.handleFirebaseAuthStateChanged.bind(this),
        error => {
          log.error(error)
          log.readiness('firebase auth error')
          this.cancelGlobalLoginOverlay()
          this.setFullPageLoading(false)
        }
      )
  }

  async handleFirebaseAuthStateChanged(firebaseUser: firebase.User | null) {
    // called after a sign in / sign up action from the user in the firebase
    // ui, and we want to generate a session cookie from it (and potentially
    // autovivify the user in the backend)
    if (firebaseUser == null) {
      this.cancelGlobalLoginOverlay()
      this.setFullPageLoading(false)
      return
    }

    log.auth('firebase user', firebaseUser)
    // and we can close the firebase ui container modal
    this.cancelGlobalLoginOverlay()
    // and switch to our own loading state
    this.setFullPageLoading(true)
    this.amplitude.flush()

    try {
      const idToken = await firebaseUser.getIdToken()

      if (this.inTrialWithContent()) {
        // Attempt to sign in with firebase while logged in as a trial user
        // with content is an attempt to claim the trial account
        await this.convertTrialAccountToClaimed(idToken)
        return
      }

      const wrapper = await this.apiClient.getMe({
        // auth on server detects idToken and uses it instead of session
        // cookie if present, note this turns it into a POST request
        idToken,
        // send the signup code because it will also assign that to the
        // user in the backend if they don't have one set yet.
        signupCode: this.signupCodeInfo ? this.signupCodeInfo.value : false,
      })
      log.readiness('acquired getMe user after firebase auth')
      this.setUser(wrapper.payload)
      this.setAmplitudeUserAttrs()

      // because we're about to reload and can't trust the amplitude
      // stuff to finish, we stash the tracking intent in localstorage
      // and do it on the next page render. (does amplitude sdk do that
      // internally?)
      if (wrapper.payload.justCreated) {
        log.auth('user is justCreated=true')
        // DRY_25748 signup tracking
        window.localStorage.setItem('pendingTrack', 'signup')
        window.localStorage.removeItem('skipBlankSlate') // DRY_26502
      } else {
        localStorage.setItem('pendingTrack', 'login')
      }

      // TODO: HBY-70 need to full page reload here otherwise layout
      // doesn't update because layout component props that are driven
      // by ssr auth are not refreshed.
      // this.setFullPageLoading(false)
      window.location.reload()
    } catch (e) {
      log.error('error acquiring user onAuthStateChanged', e)
      // this is what happens if the user is banned, or if there's a
      // network error on any of the critical api sequences.  better
      // error handling is important but for now, we will just force a
      // page reload.
      // TODO: better handling here.
      window.location.reload()
    }
  }

  launchGlobalLoginOverlay(overrideCodeCheck: boolean) {
    this.trackEvent(trackingEvents.bcLoginSignup)
    this.loginErrorMode = false
    console.log('signupCodeInfo', this.signupCodeInfo)
    // DRY_47693 signup code logic
    if (this.signupCodeInfo === false) {
      // with no code present, we don't show any special case ui, we just let
      // them sign in and if they sign up for a new account, they'll land on
      // an unsolicited user page.
      // log.debug('code is falsy so just open modal')
      this.firebaseModalOpen = true
      return
    }
    if (overrideCodeCheck) {
      // when overrideCodeCheck is true, we found the signupCode was invalid
      // but presented the user with a "login with existing account" button.
      // if they do sign up this way, which is allowed via firebase, they end
      // up in the unsolicited state, same as if they used the signupCode=false
      // flow.
      // log.debug('overrideCodeCheck=true so just open modal')
      this.firebaseModalOpen = true
      return
    }

    // TODO: okay get this, totally weird bug: if i render the
    // StyledFirebaseAuth UI (see LoginGlobalOverlay) on a promise handler
    // after an API call (the call to validate the signup code) that works
    // ONCE and ONLY ONCE. if you close the modal, then click the button
    // again, the UI makes this wierd full page content flash and then
    // vanishes. however, if i launch the auth modal synchronously with the
    // button click, it can be opened/closed repeatedly and indefinitely.
    // SOOOO, i'm doing it async the first time and then stashing the api
    // call so that the next time, it can be sync with the button click. this
    // is some insane weird SPA magic voodoo bug stuff.  took hours to
    // meticulously narrow down that this was the issue.

    if (this.signupCodeInfo) {
      if (this.signupCodeInfo.active) {
        this.firebaseModalOpen = true
        return
      } else {
        this.loginErrorMode = '_inactive_code_'
        return
      }
    }
  }

  cancelGlobalLoginOverlay() {
    this.firebaseModalOpen = false
    this.loginErrorMode = false
  }

  async loginWithAppleId(credential: AppleAuthenticationCredential) {
    if (this.user) throw new Error('must be unauthed')
    const wrapper = await this.apiClient.sessionLoginWithAppleId({ credential })
    this.trackEvent(trackingEvents.caAppleIDLogin, {})
    window.location.assign(`/`)
  }

  async loginAsNewTrialUser() {
    if (this.signupCodeInfo === false) {
      // TODO: this shouldn't happen - need to log an error?
      return
    }
    if (this.user) throw new Error('must be unauthed')
    const wrapper = await this.apiClient.sessionLoginAsTrialUser({
      signupCode: this.signupCodeInfo.value,
    })
    this.trackEvent(trackingEvents.caNewTrial, {
      signupCodeName: this.signupCodeInfo
        ? this.signupCodeInfo.name
        : undefined,
    })

    // Clear skipBlankSlate so that it appears again in case this user had
    // a trial account in the past (e.g. mainly us testing?)
    window.localStorage.removeItem(
      'skipBlankSlate' // DRY_26502
    )

    // TODO: move this to a mockable library?
    window.location.assign(`/`)
  }

  async beginClaimTrialAccount() {
    this.launchGlobalLoginOverlay(false)
  }

  inTrialBlankSlate() {
    const user = this.user
    if (!user) return false
    if (!user.isTrial) return false
    const hasProjects = Object.keys(user.profile.projects).length > 0
    if (hasProjects) return false
    const hasProfileEdits =
      user.profile.name || user.userSlug || user.profile.imageAssetId
    return !hasProfileEdits
  }

  inTrialWithContent() {
    const user = this.user
    if (!user) return false
    if (!user.isTrial) return false
    return !this.inTrialBlankSlate()
  }

  setTrialAccountClaimed() {
    window.localStorage.setItem(KEY_TRIAL_ACCOUNT_CLAIMED, 'true')
  }

  wasTrialAccountClaimed() {
    if (typeof window === 'undefined') {
      return false
    }
    return window.localStorage.getItem(KEY_TRIAL_ACCOUNT_CLAIMED) === 'true'
  }

  clearTrialAccountClaimed() {
    window.localStorage.removeItem(KEY_TRIAL_ACCOUNT_CLAIMED)
  }

  async convertTrialAccountToClaimed(claimIdToken: string) {
    if (!this.user) throw new Error('must be authed')
    try {
      const wrapper = await this.apiClient.claimTrialUser({ claimIdToken })
      if (wrapper.success) {
        // TODO: move this to a mockable library?
        this.setTrialAccountClaimed()
        // DRY_25748 signup tracking
        window.localStorage.setItem('pendingTrack', 'signup')
        window.location.assign(`/user/${wrapper.payload.systemSlug}/edit`)
      }
    } catch (e) {
      // TODO: need a better error reporting dialogue
      window.alert("Sign up failed, please try a different email address.")
      log.error('Account claim attempt failed')
      window.location.reload()
    }
  }

  setUser(x: ApiUser | false) {
    log.auth('setuser', x)
    if (x) {
      log.auth('store acquired user', x)
      this.user = x
      this.amplitude.setUserId(x.id)
      // If we have signup code info, remove it from storage.
      if (this.signupCodeInfo) {
        this.signupCodeInfo = false
      }
      this.userListeners.forEach(fn => fn(x))
      // DRY_47693 signup code logic
      // if we have a signup code on the url, clear it
      if (this.signupCodeInfo && typeof window !== 'undefined') {
        log.location('removing signupCode from url')
        const url = new URL(window.location.toString())
        url.searchParams.delete('signupCode')
        window.history.replaceState({}, '', url.toString())
      }
    } else {
      log.auth('store clearing user')
    }
  }

  registerUserListener(fn: UserListenerFn) {
    this.userListeners.push(fn)
    if (this.user) fn(this.user)
    return () => {
      this.userListeners = this.userListeners.filter(x => x !== fn)
    }
  }

  isNativeIOS() {
    if (typeof window !== 'undefined') {
      // @ts-ignore: ReactNativeWebView is injected by react native and isn't a known prop of window object by tsserver.
      if (window.ReactNativeWebView) {
        // we're in react native. assume this is iOS.
        // TODO: detect android vs iOS when we do android.
        return true
      }
    }
    return false
  }

  screenSize() {
    // https://tailwindcss.com/docs/responsive-design
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) { return 'xs' }
      if (window.innerWidth < 768) { return 'sm' }
      if (window.innerWidth < 1024) { return 'md' }
      if (window.innerWidth < 1280) { return 'lg' }
      if (window.innerWidth < 1536) { return 'xl' }
      return '2xl'
    }
    return ''
  }

  setAmplitudeUserAttrs() {
    if (!this.user) return false
    const identifyOps = new this.amplitude.Identify()
    if (this.user.signupCodeName) {
      // if the user has a signup code, make sure it's set in the amplitude user properties
      log.tracking('identify() signupCode')
      identifyOps.setOnce('signupCodeName', this.user.signupCodeName)
      identifyOps.setOnce('hasSignupCode', '1')
    }
    log.tracking('identify() slugs')
    identifyOps.setOnce('systemSlug', this.user.systemSlug)
    if (this.user.userSlug) identifyOps.set('userSlug', this.user.userSlug)
    if (this.isNativeIOS()) identifyOps.set('hasIOSLogin','1')
    this.amplitude.identify(identifyOps)
  }

  async logOut() {
    // we have to call the api to delete the cookie because it's httpOnly
    log.auth('store logOut')
    this.trackEvent(trackingEvents.bcLogout)
    this.amplitude.setUserId(undefined)
    this.amplitude.flush()
    return this.apiClient
      .sessionLogout()
      .then(() => {
        if (this.appShellApiRef) {
          this.appShellApiRef.request('signin')
        }
        window.location.assign('/')
      })
      .catch(() => {
        this.setGeneralError('_api_fail_')
      })
  }

  // }}}

  trackEvent(evt: EventSpec, opts?: EventSpec['opts']) {
    const key = evt.key
    const fullEvent = JSON.parse(JSON.stringify(trackingEvents[key]))
    if (!fullEvent) {
      log.error(`tracked event is not in trackingEvents (${evt})`)
      return
    }
    fullEvent.opts = { ...fullEvent.opts, ...opts }
    fullEvent.opts.isAuthed = this.user ? 'y' : 'n'
    if (!fullEvent.opts.slug && this.user) {
      fullEvent.opts.slug = this.user.publicPageSlug
    }
    fullEvent.opts.isTrial = (this.user && this.user.isTrial) ? 'y' : 'n'
    fullEvent.opts.appPlatform = this.isNativeIOS() ? 'ios' : 'web'
    fullEvent.opts.screenSize = this.screenSize()
    log.tracking(
      fullEvent.eventName,
      fullEvent.opts.name,
      JSON.stringify(fullEvent)
    )
    this.amplitude.track(fullEvent.eventName, fullEvent.opts)
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

  async savePost(
    post: ApiPost,
    mode: 'new' | 'edit',
    mediaType: PostMediaType
  ): Promise<ApiPost> {
    if (!this.user) throw new Error('must be authed')
    const numProjects = Object.keys(this.user.profile.projects).length
    const numPosts = Object.values(this.user.profile.projects).map(p => Object.keys(p.posts).length).reduce((a,b)=>a+b,0)
    return this.apiClient.savePost({ post }).then(wrapper => {
      this.setUser(wrapper.payload.user)
      if (mode === 'new') {
        if (post.projectId === 'new') {
          this.trackEvent(trackingEvents.caNewPost, {
            newProject: 'y',
            mediaType,
            numProjects,
            numPosts,
          })
          this.trackEvent(trackingEvents.caNewProject, {
            asPartOfNewPost: 'y',
            mediaType,
            numProjects,
            numPosts,
          })
        } else {
          this.trackEvent(trackingEvents.caNewPost, {
            newProject: 'n',
            mediaType,
            numProjects,
            numPosts,
          })
        }
      } else {
        this.trackEvent(trackingEvents.edPost, { mediaType })
      }
      return wrapper.payload.post
    })
  }

  async saveProject(
    project: ApiProject,
    mode: 'new' | 'edit',
    originalProject?: ApiProject
  ): Promise<ApiProject> {
    if (!this.user) throw new Error('must be authed')
    if (originalProject && originalProject.scope !== project.scope) {
      if (project.scope === 'public') {
        this.trackEvent(trackingEvents.caSetProjectPublic)
      } else {
        this.trackEvent(trackingEvents.caSetProjectPrivate)
      }
    }
    return this.apiClient.saveProject({ project }).then(wrapper => {
      this.setUser(wrapper.payload.user)
      if (mode === 'new') {
        this.trackEvent(trackingEvents.caNewProject, { asPartOfNewPost: 'n' })
      } else {
        this.trackEvent(trackingEvents.edProject)
      }
      return wrapper.payload.project
    })
  }

  goBack() {
    this.router.back()
  }

  promptDeleteAccount(appshellapiref: AppShellAPI) {
    if (!this.user) return false
    this.appShellApiRef = appshellapiref // need this to tell app shell to log out
    this.confirmingDelete = {
      kind: 'account',
      thing: this.user,
      deleting: false,
    }
    this.showConfirmDeleteModal = true
  }

  promptDeletePost(post: ApiPost) {
    this.confirmingDelete = {
      kind: 'post',
      thing: post,
      deleting: false,
    }
    this.showConfirmDeleteModal = true
  }

  promptDeleteProject(project: ApiProject) {
    this.confirmingDelete = {
      kind: 'project',
      thing: project,
      deleting: false,
    }
    this.showConfirmDeleteModal = true
  }

  onDeleteResult(res: 'yes' | 'no') {
    if (this.confirmingDelete && res === 'yes') {
      this.confirmingDelete.deleting = true
      if (this.confirmingDelete.kind === 'account') {
        // i'm firing the caDeleteAccount event here before the api call,
        // because i'm not trusting amplitude to track this event if we follow
        // it right with a setUserId(undef) and flush() call, not sure.
        this.trackEvent(trackingEvents.caDeleteAccount, { })
        this.apiClient
          .deleteAccount()
          .then(() => {
            this.showConfirmDeleteModal = false
            setTimeout(() => {
              this.confirmingDelete = false
            }, modalTransitionTime)
            this.amplitude.setUserId(undefined)
            this.amplitude.flush()
            if (this.appShellApiRef) {
              this.appShellApiRef.request('signin')
            }
            window.location.assign('/')
          })
      }
      if (this.confirmingDelete.kind === 'post') {
        this.apiClient
          .deletePost({
            postId: this.confirmingDelete.thing.id,
            projectId: this.confirmingDelete.thing.projectId,
          })
          .then(wrapper => {
            if (
              this.confirmingDelete &&
              this.confirmingDelete.kind === 'post'
            ) {
              const projectId = this.confirmingDelete.thing.projectId
              this.showConfirmDeleteModal = false
              setTimeout(() => {
                this.confirmingDelete = false
              }, modalTransitionTime)
              this.setUser(wrapper.payload.user)
              this.router.push(
                pathBuilder.project(wrapper.payload.user.systemSlug, projectId)
              )
            }
          })
      }
      if (this.confirmingDelete.kind === 'project') {
        this.apiClient
          .deleteProject({ projectId: this.confirmingDelete.thing.id })
          .then(wrapper => {
            this.showConfirmDeleteModal = false
            setTimeout(() => {
              this.confirmingDelete = false
            }, modalTransitionTime)
            // note: upating the user here causes a flash of "not found" page
            // this.setUser(wrapper.payload)
            // we can actually just rely on nextjs's server side props behavior
            // to refetch the user on navigation.
            this.router.push(pathBuilder.user(wrapper.payload.systemSlug))
          })
      }
    } else {
      this.showConfirmDeleteModal = false
      setTimeout(() => {
        this.confirmingDelete = false
      }, modalTransitionTime)
    }
  }

  async saveProfile(profile: ApiProfile, userSlug?: string): Promise<void> {
    if (!this.user) throw new Error('must be authed')
    const trackFields = profileUtils.newFieldCompare(profile, this.user.profile)
    if (userSlug && !this.user.userSlug) {
      trackFields.push('slug')
    }
    trackFields.forEach(field => {
      this.trackEvent(trackingEvents.caProfileField, { name: field })
    })
    if (
      profileUtils.hasAllFields(profile) &&
      (userSlug || this.user.userSlug)
    ) {
      this.trackEvent(trackingEvents.caProfileAll)
    }
    return this.apiClient.saveProfile({ profile, userSlug }).then(wrapper => {
      this.setUser(wrapper.payload)
      this.trackEvent(trackingEvents.edProfile)
      this.router.push(pathBuilder.user(wrapper.payload.systemSlug))
      this.setAmplitudeUserAttrs()
      // return wrapper.payload
    })
  }
}

export default Store
