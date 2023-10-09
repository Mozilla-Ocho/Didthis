export default ({ config }) => {
  return {
    ...config,
    name: "Didthis",
    slug: "didthis",
    owner: "mozilla-ocho-h3y",
    // owner: "lmorchard",
    ios: {
      //bundleIdentifier: "org.mozilla.Didthis"
      // lmorchard's old sandbox expo project
      bundleIdentifier: "com.lmorchard.Didthis",
    },
    extra: {
      eas: {
        // mozilla-ocho-h3y org project
        projectId: "d1216396-7cf9-4a41-9543-ce7e31e0529b",
        // lmorchard's old sandbox expo project
        // projectId: "bb2e6caf-a447-43b6-86cb-4ee477e6abc3",
      },
    },
    updates: {
      url: "https://u.expo.dev/d1216396-7cf9-4a41-9543-ce7e31e0529b",
      // lmorchard's old sandbox expo project
      // url: "https://u.expo.dev/bb2e6caf-a447-43b6-86cb-4ee477e6abc3",
    },
    runtimeVersion: {
      policy: "sdkVersion",
    },
  };
};
