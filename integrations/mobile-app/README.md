# Didthis Mobile App

This is a mobile app for Didthis, implemented using React Native and Expo.

## Using Previews from Pull Requests

In Pull Requests, you may see a comment which reads "🚀 Expo preview is ready!" and offers the image of a QR code.

This QR code may be scanned to use a preview of the changes in the Pull Request.

To use these previews, install the [Expo Go](https://expo.dev/expo-go) app on one of your mobile devices:

- https://expo.dev/expo-go

## Development

### Quick start

- Follow the [installation docs for Expo](https://docs.expo.dev/get-started/installation/)
- Ensure you have an instance of [the Didthis server stack](github.com/mozilla-Ocho/h3y) running locally.
- Find the IP address and port of the web server (e.g. `192.168.0.104:3000`)
- Start the Expo bundler and substitute your server's address as `EXPO_PUBLIC_SITE_BASE_URL`
  ```bash
  export EXPO_PUBLIC_SITE_BASE_URL='http://192.168.0.104:3000'
  yarn install
  yarn start
  ```
- You can also start the Expo bundler in Storybook mode:
  ```bash
  yarn storybook
  ```
- See [`package.json`](./package.json) for further available scripts.

### Advanced development

#### Full local app build (iOS on macOS)
These commands will generate native code from the Expo project, build the app with Xcode, and then launch it in a simulator.

```
xcode-select --install
npx expo prebuild
yarn ios
```
