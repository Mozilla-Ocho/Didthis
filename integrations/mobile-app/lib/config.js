import * as Updates from 'expo-updates';

// see also: https://docs.expo.dev/guides/environment-variables/
const storybookEnabled = process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === "true";
const siteBaseUrl =
  process.env.EXPO_PUBLIC_SITE_BASE_URL || "https://test.didthis.app";

const originWhitelist = [
  siteBaseUrl,
  "https://moz-fx-future-products-prod.firebaseapp.com",
  "https://moz-fx-future-products-nonprod.firebaseapp.com",
  "https://upload-widget.cloudinary.com",
  "https://widget.cloudinary.com",
  "https://res-s.cloudinary.com",
];

const Config = {
  storybookEnabled,
  siteBaseUrl,
  originWhitelist,
};

// see eas.json for channel definitions
if (Updates.channel === "production") {
  Config.siteBaseUrl = "https://didthis.app";
} else if (Updates.channel === "preview") {
  Config.siteBaseUrl = "https://this.didthis.app";
} else if (Updates.channel === "storybook") {
  Config.storybookEnabled = true;
} else if (Updates.channel === "development") {
  // e.g. EXPO_PUBLIC_SITE_BASE_URL='http://192.168.0.104:3000' yarn start
}

export default Config;
