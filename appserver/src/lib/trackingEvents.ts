// initially defining these without the "key" prop because it makes the code
// really awkward/redundant, but we need the key prop for convenience later on,
// so i compose the final object by adding key props down below.
type KeylessEventSpec = Omit<EventSpec, 'key'>
const keylessTrackingEvents: { [key: string]: KeylessEventSpec } = {
  // note most events will include an isAuthed:y|n parameter by default.

  // pageviews
  pvHomeUnauth: { eventName: 'pageview', opts: { name: 'homeUnauth' } },
  pvHomeAuth: { eventName: 'pageview', opts: { name: 'homeAuth' } },
  pvUnsolicited: { eventName: 'pageview', opts: { name: 'unsolicited' } },
  pvPrivacyPolicy: { eventName: 'pageview', opts: { name: 'privacyPolicy' } },
  pvTerms: { eventName: 'pageview', opts: { name: 'terms' } },
  pvAcceptableUse: { eventName: 'pageview', opts: { name: 'acceptableUse' } },
  pvNotFound: { eventName: 'pageview', opts: { name: 'notFound' } },
  pvPublicHomepage: {
    eventName: 'pageview',
    opts: { name: 'publicHomepage' /* isAuthed:y|n, isSelfView:y|n */ },
  },

  // completed actions
  caJoinWaitlist: { eventName: 'joinWaitlist', opts: {} },
  caSignup: {
    eventName: 'signup',
    opts: {
      /* signupCodeName */
    },
  },
  caLogin: { eventName: 'login', opts: {} },
  caProfileBasicsName: {
    eventName: 'completeBasicField',
    opts: { name: 'name' },
  },
  caProfileBasicsSlug: {
    eventName: 'completeBasicField',
    opts: { name: 'slug' },
  },
  caProfileBasicsAvatar: {
    eventName: 'completeBasicField',
    opts: { name: 'avatar' },
  },
  caProfileBasicsAll: { eventName: 'completeAllBasicFields', opts: {} },
  caNewPostNewProj: {
    eventName: 'newPost',
    opts: { newProject: 'y' },
  },
  caNewPost: {
    eventName: 'newPost',
    opts: { newProject: 'n' },
  },
  caNewProject: {
    eventName: 'newProject',
    opts: { },
  },

  // edit actions
  edProfileBasicsName: {
    eventName: 'editBasicField',
    opts: { name: 'name' },
  },
  edProfileBasicsSlug: {
    eventName: 'editBasicField',
    opts: { name: 'slug' },
  },
  edProfileBasicsAvatar: {
    eventName: 'editBasicField',
    opts: { name: 'avatar' },
  },

  // button clicks (not necessarily resulting in a completed action)
  bcLoginSignup: {
    eventName: 'buttonClick',
    opts: { name: 'loginSignup' },
  },
  bcLogout: { eventName: 'buttonClick', opts: { name: 'logout' } },
  bcViewPage: { eventName: 'buttonClick', opts: { name: 'viewPage' } },
  bcFeedback: { eventName: 'buttonClick', opts: { name: 'feedback' } },
  bcWaitlist: {
    eventName: 'buttonClick',
    opts: { name: 'joinWaitlist' },
  },

  // errors
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
