export default ({ config }) => {
  const siteBaseUrl = process.env.SITE_BASE_URL || "https://didthis.app";

  return {
    ...config,
    name: "Storybook Tutorial Template",
    slug: "storybook-tutorial-template",
    extra: {
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
  };
};
