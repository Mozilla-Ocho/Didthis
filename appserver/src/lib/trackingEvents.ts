// initially defining these without the "key" prop because it makes the code
// really awkward/redundant, but we need the key prop for convenience later on,
// so i compose the final object by adding key props down below.
type KeylessEventSpec = Omit<EventSpec, 'key'>
const keylessTrackingEvents: { [key: string]: KeylessEventSpec } = {
  // note most events will include an isAuthed:y|n parameter by default.

  // pageviews
  // will also contain isAuthed:y|n, slug:string
  pvHomeUnauth: { eventName: 'pageview', opts: { name: 'homeUnauth' } },
  pvHomeAuth: { eventName: 'pageview', opts: { name: 'homeAuth' } },
  pvUser: { eventName: 'pageview', opts: { name: 'user' } },
  pvUnsolicited: { eventName: 'pageview', opts: { name: 'unsolicited' } },
  pvPrivacyPolicy: { eventName: 'pageview', opts: { name: 'privacyPolicy' } },
  pvTerms: { eventName: 'pageview', opts: { name: 'terms' } },
  pvContentPolicy: { eventName: 'pageview', opts: { name: 'contentPolicy' } },
  pvNotFound: { eventName: 'pageview', opts: { name: 'notFound' } },
  pvPublicUser: { eventName: 'pageview', opts: { name: 'publicUser' }, },
  pvPublicProject: { eventName: 'pageview', opts: { name: 'publicProject' }, },
  pvNewPost: { eventName: 'pageview', opts: { name: 'newPost' }, },
  pvEditPost: { eventName: 'pageview', opts: { name: 'editPost' }, },
  pvProject: { eventName: 'pageview', opts: { name: 'project' }, },
  pvNewProject: { eventName: 'pageview', opts: { name: 'newProject' }, },
  pvEditProject: { eventName: 'pageview', opts: { name: 'editProject' }, },
  pvEditAccount: { eventName: 'pageview', opts: { name: 'editAccount' }, },


  // completed actions
  caJoinWaitlist: { eventName: 'joinWaitlist', opts: {} },
  caSignup: {
    eventName: 'signup',
    opts: {
      /* signupCodeName */
    },
  },
  caLogin: { eventName: 'login', opts: {} },
  caProfileField: {
    eventName: 'completeProfileField',
    opts: {
      /* name: */
    },
  },
  caProfileAll: { eventName: 'completeAllProfileFields', opts: {} },
  caNewPostNewProj: {
    eventName: 'newPost',
    opts: { newProject: 'y' /* mediaType */ },
  },
  caNewPost: {
    eventName: 'newPost',
    opts: { newProject: 'n' /* mediaType */ },
  },
  caNewProject: {
    eventName: 'newProject',
    opts: {},
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
    opts: { /* direction */ },
  },
  caUploadImage: {
    eventName: 'uploadImage',
    opts: { /* imgIntent */ },
  },
  caLightbox: {
    eventName: 'lightbox',
    opts: { /* imgIntent */ },
  },

  // edit actions
  edProfile: {
    eventName: 'editProfile',
    opts: {},
  },
  edProject: {
    eventName: 'editProject',
    opts: {
      /* field */
    },
  },
  edPost: {
    eventName: 'editPost',
    opts: {
      /* mediaType */
    },
  },

  // button clicks (not necessarily resulting in a completed action)
  bcLoginSignup: {
    eventName: 'buttonClick',
    opts: { name: 'loginSignup' },
  },
  bcLogout: { eventName: 'buttonClick', opts: { name: 'logout' } },
  bcWaitlist: {
    eventName: 'buttonClick',
    opts: { name: 'joinWaitlist' },
  },
  bcSharePublicProject: {
    eventName: 'buttonClick',
    opts: { name: 'sharePublicProject' },
  },
  bcSharePrivateProject: {
    eventName: 'buttonClick',
    opts: { name: 'sharePrivateProject' },
  },
  bcAddPost: {
    eventName: 'buttonClick',
    opts: { name: 'bcAddPost', /* fromPage */  },
  },
  bcCreatProjectHomeAuth: {
    eventName: 'buttonClick',
    opts: { name: 'bcCreatProjectHomeAuth' },
  },
  bcSkipBlankSlate: {
    eventName: 'buttonClick',
    opts: { name: 'bcSkipBlankSlate' },
  },
  bcEditProjectFromCard: {
    eventName: 'buttonClick',
    opts: { name: 'bcEditProjectFromCard' },
  },
  bcEditPostFromCard: {
    eventName: 'buttonClick',
    opts: { name: 'bcEditPostFromCard' },
  },
  bcDiscord: {
    eventName: 'buttonClick',
    opts: { name: 'bcDiscord' },
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
