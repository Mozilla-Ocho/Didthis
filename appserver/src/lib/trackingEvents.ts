type EventSpec = {
  eventName: string,
  key?: string,
  opts: {
    name?: string,
    isAuthed?: "y" | "n",
    isSelfView?: "y"|"n",
    signupCodeName?:string,
    id?:string,
    newProject?: "y" | "n", 
  }
}

const trackingEvents: {[key:string]:EventSpec} = {
  // note most events will include an isAuthed:y|n parameter by default.

  // pageviews
  pvHomeUnauth: { eventName: "pageview", opts: { name: "homeUnauth" } },
  pvHomeAuth: { eventName: "pageview", opts: { name: "homeAuth" } },
  pvUnsolicited: { eventName: "pageview", opts: { name: "unsolicited" } },
  pvPrivacyPolicy: { eventName: "pageview", opts: { name: "privacyPolicy" } },
  pvTerms: { eventName: "pageview", opts: { name: "terms" } },
  pvAcceptableUse: { eventName: "pageview", opts: { name: "acceptableUse" } },
  pvNotFound: { eventName: "pageview", opts: { name: "notFound" } },
  pvPublicHomepage: {
    eventName: "pageview",
    opts: { name: "publicHomepage" /* isAuthed:y|n, isSelfView:y|n */ },
  },

  // completed actions
  caJoinWaitlist: { eventName: "joinWaitlist", opts: {} },
  caSignup: {
    eventName: "signup",
    opts: {
      /* signupCodeName */
    },
  },
  caLogin: { eventName: "login", opts: {} },
  caProfileBasicsName: {
    eventName: "completeBasicField",
    opts: { name: "name" },
  },
  caProfileBasicsSlug: {
    eventName: "completeBasicField",
    opts: { name: "slug" },
  },
  caProfileBasicsAvatar: {
    eventName: "completeBasicField",
    opts: { name: "avatar" },
  },
  caProfileBasicsAll: { eventName: "completeAllBasicFields", opts: {} },
  caNewPostNewProj: {
    eventName: "newPost",
    opts: { newProject: "y" },
  },
  caNewPost: {
    eventName: "newPost",
    opts: { newProject: "n" },
  },

  // edit actions
  edProfileBasicsName: {
    eventName: "editBasicField",
    opts: { name: "name" },
  },
  edProfileBasicsSlug: {
    eventName: "editBasicField",
    opts: { name: "slug" },
  },
  edProfileBasicsAvatar: {
    eventName: "editBasicField",
    opts: { name: "avatar" },
  },

  // button clicks (not necessarily resulting in a completed action)
  bcLoginSignup: {
    eventName: "buttonClick",
    opts: { name: "loginSignup" },
  },
  bcLogout: { eventName: "buttonClick", opts: { name: "logout" } },
  bcViewPage: { eventName: "buttonClick", opts: { name: "viewPage" } },
  bcFeedback: { eventName: "buttonClick", opts: { name: "feedback" } },
  bcWaitlist: {
    eventName: "buttonClick",
    opts: { name: "joinWaitlist" },
  },

  // errors
  apiError: {
    eventName: "apiError",
    opts: {
      /* action */
    },
  },
};

type TrackingEventName = keyof typeof trackingEvents

//Object.keys(trackingEvents).map((key:TrackingEventName) => (trackingEvents[key].key = key));

for (let key in trackingEvents) {
  trackingEvents[key].key = key
}

// make another variable who is strongly typed to the values for the keys and export that
const te2:{[key:TrackingEventName]:EventSpec} = trackingEvents

export { te2 as trackingEvents };
