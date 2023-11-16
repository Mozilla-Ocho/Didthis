import * as Updates from "expo-updates";

// see also: https://docs.expo.dev/guides/environment-variables/
let storybookEnabled = process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === "true";

let siteBaseUrl =
  process.env.EXPO_PUBLIC_SITE_BASE_URL || "https://test.didthis.app";

let baseOriginWhitelist = [
  "https://moz-fx-future-products-prod.firebaseapp.com",
  "https://moz-fx-future-products-nonprod.firebaseapp.com",
  "https://upload-widget.cloudinary.com",
  "https://widget.cloudinary.com",
  "https://res-s.cloudinary.com",
];

// see eas.json for channel definitions
if (Updates.channel === "production") {
  siteBaseUrl = "https://didthis.app";
} else if (Updates.channel === "preview") {
  siteBaseUrl = "https://test.didthis.app";
} else if (Updates.channel === "storybook") {
  storybookEnabled = true;
} else if (Updates.channel === "development") {
  // e.g. EXPO_PUBLIC_SITE_BASE_URL='http://192.168.0.104:3000' yarn start
}

const Config = {
  storybookEnabled,
  siteBaseUrl,
  originWhitelist: [siteBaseUrl, ...baseOriginWhitelist],
  legalUrls: {
    terms: 'https://didthis.app/terms',
    privacy: 'https://didthis.app/privacy',
    content: 'https://didthis.app/content',
  },
};

export default Config;
