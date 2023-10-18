# Development

Rough notes on common development tasks.

## Pull Requests and automated preview builds

In Pull Requests, you may see a comment which reads "🚀 Expo preview is ready!" along with a QR code. To use this QR code to preview changes, install the [Expo Go](https://expo.dev/expo-go) app on one of your mobile devices:

- https://expo.dev/expo-go

These previews are built and deployed to [the `mozilla-ocho-hey` EAS account](https://expo.dev/accounts/mozilla-ocho-h3y) via this GitHub Action:

- [expo-pr-preview.yml](../.github/workflows/expo-pr-preview.yml)

## Quick start (on macOS)

- Install Xcode and friends
  ```bash
  xcode-select --install
  ```
- Follow the [installation docs for Expo](https://docs.expo.dev/get-started/installation/)
- Ensure you have an instance of [the Didthis server stack](github.com/mozilla-Ocho/h3y) running locally.
- Find the IP address and port of the web server (e.g. `192.168.0.104:3000`)
- Start the Expo bundler and substitute your server's address as `EXPO_PUBLIC_SITE_BASE_URL`
  ```bash
  yarn install
  EXPO_PUBLIC_SITE_BASE_URL='http://192.168.0.104:3000' yarn start
  ```
- You can also start the Expo bundler in Storybook mode:
  ```bash
  yarn storybook
  ```
- See [`package.json`](./package.json) for further available scripts.

## Full local app build (iOS on macOS)

- Generate the native code for the app
  ```bash
  npx expo prebuild
  ```
- After this command, there should be an `ios` folder containing an Xcode project you can open in the IDE, if desired.
- Otherwise, this shell command builds the app and opens it in a simulator:
  ```
  yarn ios
  ```

## Apple Developer Account

As a developer, you'll probably need an [Apple Developer Account](https://developer.apple.com/). Many tasks can be accomplished without one, but eventually you'll need it to do anything related to code signing, deployment, or release.

To begin the process of requesting an account on the Mozilla-wide team, file a Bugzilla bug here:

- https://bugzilla.mozilla.org/enter_bug.cgi?product=App%20Stores&component=App%20Store%20Access

It can also be handy to register your own personal account, if only for experimentation and staging with elevated permissions not granted to normal developer accounts at Mozilla.
