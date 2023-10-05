export default ({ config }) => {
  const siteBaseUrl = process.env.SITE_BASE_URL || "https://didthis.app";

  return {
    ...config,
    name: "Didthis Prototype",
    slug: "didthis-prototype",
    owner: "lmorchard",
    extra: {
      eas: {
        projectId: "bb2e6caf-a447-43b6-86cb-4ee477e6abc3",
      },
      storybookEnabled: process.env.STORYBOOK_ENABLED,
      siteBaseUrl,
      originWhitelist: [
        siteBaseUrl,
        "https://moz-fx-future-products-prod.firebaseapp.com",
        "https://moz-fx-future-products-nonprod.firebaseapp.com",
        "https://upload-widget.cloudinary.com",
        "https://widget.cloudinary.com",
        "https://res-s.cloudinary.com",
      ],
    },
    updates: {
      url: "https://u.expo.dev/bb2e6caf-a447-43b6-86cb-4ee477e6abc3",
    },
    runtimeVersion: {
      policy: "sdkVersion",
    },
  };
};
