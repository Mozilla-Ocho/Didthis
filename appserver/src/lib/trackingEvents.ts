const trackingEvents = {
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
  caProfilePrompt: {
    eventName: "completePrompt",
    opts: {
      /* id, format, completedPromptCount */
    },
  },
  caDeletePrompt: {
    eventName: "deletePrompt",
    opts: {
      /* id, format, completedPromptCount */
    },
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
  edProfilePrompt: {
    eventName: "editPrompt",
    opts: {
      /* id, format, completedPromptCount */
    },
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
  bcGetDifferentPrompt: {
    eventName: "buttonClick",
    opts: { name: "getDifferentPrompt" /* skippedPromptId, skippedFormat */ },
  },
  bcBasicsGetStarted: {
    eventName: "buttonClick",
    opts: { name: "profileBasicsGetStarted" },
  },

  // errors
  apiError: {
    eventName: "apiError",
    opts: {
      /* action */
    },
  },
};

Object.keys(trackingEvents).map((key) => (trackingEvents[key].key = key));

export { trackingEvents };
