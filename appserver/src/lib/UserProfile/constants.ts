const constants = {
  CURRENT_VERSION: 2,

  PROFILE_KEYS: [
    'version',
    'name',
    'bio',
    'avatarPublicID',
  ],

  MAX_CHARS: {
    names: 140,
    cloudinaryAssetIds: 100,
    urls: 300,
    urlMetaProps: 1000,
    userBlurbs: 1000,
  },

  mkDefaultProfile: () =>
    // DRY_r1622 initial state of an empty profile
    // default values in new profiles or when a user deletes/resets part of their
    // profile.
    ({
      version: constants.CURRENT_VERSION,
      name: '',
      avatarPublicID: '',
      bio: '',
      promptResponses: [],
    }),

  normalizeUrlConfig: {
    // we're not using normalizeUrl to strip down urls to their essentials, we
    // are using it as a user input parser that is more lenient than URL() lib.
    // for example you can give it 'twitter.com/foo' and it will return
    // 'https://twitter.com/foo' where URL() would throw an error.
    defaultProtocol: 'https:',
    removeTrailingSlash: false,
    removeSingleSlash: false,
    stripTextFragment: false,
    stripAuthentication: false,
    stripHash: false,
    stripProtocol: false,
    stripWWW: false,
    removeDirectoryIndex: false,
    sortQueryParameters: false,
  },
};

export { constants };
