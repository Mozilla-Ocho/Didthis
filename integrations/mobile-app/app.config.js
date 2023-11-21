import withRemoveiOSNotificationEntitlement from "./config-plugins/withRemoveiOSNotificationEntitlement";

const updateChannel = process.env.EXPO_CHANNEL || "development";

export default ({ config }) => {
  return {
    ...config,
    name: "Didthis",
    slug: "didthis",
    icon: "./assets/didthis-snap-logo.png",
    owner: "mozilla-ocho-h3y",
    android: {
      package: "org.mozilla.Didthis",
    },
    ios: {
      bundleIdentifier: "org.mozilla.Didthis",
      buildNumber: "4",
      usesAppleSignIn: true,
      config: {
        usesNonExemptEncryption: false,
      },
    },
    extra: {
      eas: {
        projectId: "d1216396-7cf9-4a41-9543-ce7e31e0529b",
      },
    },
    updates: {
      url: "https://u.expo.dev/d1216396-7cf9-4a41-9543-ce7e31e0529b",
      requestHeaders: {
        "expo-channel-name": updateChannel,
      },
    },
    runtimeVersion: {
      policy: "sdkVersion",
    },
    plugins: [
      ...(config.plugins ?? []),
      [withRemoveiOSNotificationEntitlement],
      "expo-apple-authentication",
      [
        "expo-image-picker",
        {
          photosPermission:
            "The app accesses your photos to let you share project updates.",
          cameraPermission:
            "This app accesses your camera to let you share project updates.",
        },
      ],
    ],
  };
};
