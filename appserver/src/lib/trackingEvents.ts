// initially defining these without the "key" prop because it makes the code
// really awkward/redundant, but we need the key prop for convenience later on,
// so i compose the final object by adding key props down below.
type KeylessEventSpec = Omit<EventSpec, 'key'>
const keylessTrackingEvents: { [key: string]: KeylessEventSpec } = {
  // note most events will include:
  // - isAuthed:y|n
  // - appPlatform:ios|web
  // - screenSize:xs...2xl

  // pageviews
  // will also contain isAuthed:y|n, slug:string
  // note the event "waitlistHomeUnauth" is historically and now badly named,
  // it's logical meaning is views of the homepage that don't contain an invite
  // code. whereas pvHomeUnauth might have an invite code. so pvHomeUnauth
  // always fires, and then either validCodeHomeUnauth or waitlistHomeUnauth fires.
  pvHomeUnauth: { eventName: 'pageview', opts: { name: 'homeUnauth', /* topicBucket */ } },
  validCodeHomeUnauth: { eventName: 'validCodeHomeUnauth', opts: { name:
    'validCodeHomeUnauth', /* signupCodeName, topicBucket */ } },
  waitlistHomeUnauth: { eventName: 'waitlistHomeUnauth', opts: { name:
    'waitlistHomeUnauth', /* topicBucket */ } },
  pvHomeAuth: { eventName: 'pageview', opts: { name: 'homeAuth' } },
  pvUser: { eventName: 'pageview', opts: { name: 'user' } },
  pvUnsolicited: { eventName: 'pageview', opts: { name: 'unsolicited' } },
  pvPrivacyPolicy: { eventName: 'pageview', opts: { name: 'privacyPolicy' } },
  pvTerms: { eventName: 'pageview', opts: { name: 'terms' } },
  pvContentPolicy: { eventName: 'pageview', opts: { name: 'contentPolicy' } },
  pvSupport: { eventName: 'pageview', opts: { name: 'support' } },
  pvNotFound: { eventName: 'pageview', opts: { name: 'notFound' } },
  pvPublicUser: { eventName: 'pageview', opts: { name: 'publicUser' } },
  pvPublicProject: { eventName: 'pageview', opts: { name: 'publicProject' } },
  pvNewPost: { eventName: 'pageview', opts: { name: 'newPost' } },
  pvEditPost: { eventName: 'pageview', opts: { name: 'editPost' } },
  pvProject: { eventName: 'pageview', opts: { name: 'project' } },
  pvNewProject: { eventName: 'pageview', opts: { name: 'newProject' } },
  pvEditProject: { eventName: 'pageview', opts: { name: 'editProject' } },
  pvEditAccount: { eventName: 'pageview', opts: { name: 'editAccount' } },

  // completed actions
  caJoinWaitlist: { eventName: 'joinWaitlist', opts: {} },
  caJoinViralWaitlist: { eventName: 'joinViralWaitlist', opts: { /* fromPage, targetUserSlug */} },
  caNewTrial: {
    eventName: 'newTrial',
    opts: {
      /* signupCodeName */
    }
  },
  caSignup: {
    eventName: 'signup',
    opts: {
      /* signupCodeName */
    },
  },
  caLogin: { eventName: 'login', opts: {} },
  caAppleIDLogin: { eventName: 'loginAppleId', opts: {} },
  authSession: { eventName: 'authSession', opts: {} },
  caProfileField: {
    /* fired when a user first saves any content in a given profile field, will be
     * fired once for any/all applicable fields eg bio, avatar, name, slug, etc */
    eventName: 'completeProfileField',
    opts: {
      /* name: */
    },
  },
  caProfileAll: {
    /* fired when a user completes all profile fields: name, slug, avatar, bio,
     * one or more social urls */
    eventName: 'completeAllProfileFields',
    opts: {},
  },
  caNewPost: {
    eventName: 'newPost',
    opts: {
      /* newProject y|n, mediaType */
    },
  },
  caNewProject: {
    eventName: 'newProject',
    opts: {
      /* asPartOfNewPost y|n - y when created as a result of making a new
      post with the 'create new project' option  */
    },
  },
  caSetProjectPublic: {
    eventName: 'setProjectPublic',
    opts: {},
  },
  caSetProjectPrivate: {
    eventName: 'setProjectPrivate',
    opts: {},
  },
  caSetProjectSort: {
    eventName: 'setProjectSort',
    opts: {
      /* direction */
    },
  },
  caUploadImage: {
    eventName: 'uploadImage',
    opts: {
      /* imgIntent */
    },
  },
  caLightbox: {
    eventName: 'lightbox',
    opts: {
      /* imgIntent */
    },
  },
  caDeleteAccount: {
    eventName: 'deleteAccount',
    opts: {}
  },

  // edit actions
  edProfile: {
    eventName: 'editProfile',
    opts: {},
  },
  edProject: {
    eventName: 'editProject',
    opts: {},
  },
  edPost: {
    eventName: 'editPost',
    opts: {
      /* mediaType */
    },
  },

  // button or link clicks (not necessarily resulting in a completed action)
  bcLoginSignup: {
    eventName: 'buttonClick',
    opts: { name: 'loginSignup' },
  },
  bcLoginTrialSignup: {
    eventName: 'buttonClick',
    opts: { name: 'loginTrialSignup' },
  },
  bcClaimTrialAccount: {
    eventName: 'buttonClick',
    opts: { name: 'claimTrialAccount' },
  },
  bcCancelClaimTrialAccount: {
    eventName: 'buttonClick',
    opts: { name: 'cancelClaimTrialAccount' },
  },
  bcLogout: { eventName: 'buttonClick', opts: { name: 'logout' /* loseTrialWork */ } },
  bcWaitlist: {
    eventName: 'buttonClick',
    opts: { name: 'joinWaitlist' },
  },
  bcViralWaitlist: {
    eventName: 'buttonClick',
    opts: { name: 'joinViralWaitlist', /* fromPage, targetUserSlug */ },
  },
  bcGetYourOwnPage: {
    eventName: 'buttonClick',
    opts: { name: 'getYourOwnPage', /* fromPage, targetUserSlug */ },
  },
  bcSharePublicProject: {
    eventName: 'buttonClick',
    opts: { name: 'sharePublicProject' }, /* fromNativeTopNav */
  },
  bcSharePrivateProject: {
    eventName: 'buttonClick',
    opts: { name: 'sharePrivateProject' }, /* fromNativeTopNav */
  },
  bcAddPost: {
    eventName: 'buttonClick',
    opts: { name: 'bcAddPost' /* fromPage */ },
  },
  bcCreatProjectHomeAuth: {
    eventName: 'buttonClick',
    opts: { name: 'bcCreatProjectHomeAuth' },
  },
  bcSkipBlankSlate: {
    eventName: 'buttonClick',
    opts: { name: 'bcSkipBlankSlate' },
  },
  bcEditProject: {
    eventName: 'buttonClick',
    opts: { name: 'editProject' }, /* fromNativeTopNav */
  },
  bcEditPost: {
    eventName: 'buttonClick',
    opts: { name: 'bcEditPost' }, /* fromNativeTopNav */
  },
  bcDiscord: {
    eventName: 'buttonClick',
    opts: { name: 'bcDiscord' },
  },
  bcDiscordNag: {
    eventName: 'buttonClick',
    opts: { name: 'bcDiscordNag' },
  },
  bcTrialAccountNag: {
    eventName: 'buttonClick',
    opts: { name: 'bcTrialAccountNag' },
  },
  bcOchoIdea: {
    eventName: 'buttonClick',
    opts: { name: 'bcOchoIdea' },
  },
  bcHeaderLogo: {
    eventName: 'buttonClick',
    opts: { name: 'bcHeaderLogo' },
  },
  bcImageUpload: {
    eventName: 'buttonClick',
    opts: { name: 'bcImageUpload' /* imgIntent */ },
  },
  bcRemoveImage: {
    eventName: 'buttonClick',
    opts: { name: 'bcRemoveImage' /* imgIntent */ },
  },
  bcDiscardChanges: {
    eventName: 'buttonClick',
    opts: { name: 'bcDiscardChanges' /* fromPage */ },
  },
  bcDeleteAccount: {
    eventName: 'deleteAccount',
    opts: { name: 'bcDeleteAccount' },
  },
  bcTestflightHP: {
    eventName: 'buttonClick',
    opts: { name: 'testflightHP' },
  },
  bcAppStoreHP: {
    eventName: 'buttonClick',
    opts: { name: 'appStoreHP' },
  },

  // DRY_76795 native event types handling
  bcNativeDrawerOpen: {
    eventName: 'buttonClick',
    opts: { name: 'nativeDrawerOpen' },
  },
  bcNativeDrawerCreateProject: {
    eventName: 'buttonClick',
    opts: { name: 'nativeDrawerCreateProject' },
  },
  bcNativeDrawerProject: {
    eventName: 'buttonClick',
    opts: { name: 'nativeDrawerProject' },
  },

  // errors
  // TODO: implement better api error handling and tracking
  apiError: {
    eventName: 'apiError',
    opts: {
      /* action */
    },
  },
}

type TrackingEventName = keyof typeof keylessTrackingEvents

// trackingEvents is strongly typed to only contain props that are the keys of
// events defined above, and we add the key prop to each so the value alone can
// be passed.
const trackingEvents: { [key: TrackingEventName]: EventSpec } = {}
for (const key in keylessTrackingEvents) {
  trackingEvents[key] = {
    ...keylessTrackingEvents[key],
    key,
  }
}

export { trackingEvents }
