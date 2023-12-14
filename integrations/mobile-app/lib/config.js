import Constants from 'expo-constants';
import * as Updates from "expo-updates";

// see also: https://docs.expo.dev/guides/environment-variables/
let buildTag = process.env.EXPO_PUBLIC_GIT_TAG || "development";
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
} else if (Updates.channel === "development") {
  // e.g. EXPO_PUBLIC_SITE_BASE_URL='http://192.168.0.104:3000' yarn start
}

const Config = {
  buildTag,
  packageVersion: Constants.expoConfig.extra?.packageVersion,
  storybookEnabled,
  siteBaseUrl,
  originWhitelist: [siteBaseUrl, ...baseOriginWhitelist],
  legalUrls: {
    terms: `${siteBaseUrl}/terms`,
    privacy: `${siteBaseUrl}/privacy`,
    content: `${siteBaseUrl}/content`,
  },
};

export default Config;
