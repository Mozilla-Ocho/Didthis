export default ({ config }) => {
  return {
    ...config,
    name: "Didthis Prototype",
    slug: "didthis-prototype",
    owner: "lmorchard",
    extra: {
      eas: {
        projectId: "bb2e6caf-a447-43b6-86cb-4ee477e6abc3",
      },
    },
    updates: {
      url: "https://u.expo.dev/bb2e6caf-a447-43b6-86cb-4ee477e6abc3",
    },
    runtimeVersion: {
      policy: "sdkVersion",
    },
  };
};
