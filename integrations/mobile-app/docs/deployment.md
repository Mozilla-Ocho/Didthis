# Deployment

Rough notes on deployment of release builds to the App Store

## tl;dr

Every commit to `main` branch results in an automated build and upload to the App Store. However, it's a manual process in the Apple App Store Connect portal to ship one of these uploaded builds to TestFlight or general release.

## Build automation in Bitrise

Mozilla uses Bitrise for mobile app build automation. This is our project:

- [`didthis-mobile-app`](https://app.bitrise.io/app/bc74a6b9-24d1-4f43-bdc6-f734bc7311ad)

To manage this project, you will need to request to be added to this access group:

- https://people.mozilla.org/a/bitrise_access/

There are several key resources in this project:

- Development code signing certificate
- Distribution code signing certificate
- App store provisioning profile

These are managed by Mozilla Release Engineering - our team does not have access or permission to generate them. Contact those folks if we need to replace or renew them - e.g. if they've expired or we need to change the app bundle ID or name.

## Pull Requests and automated preview builds

For each Pull Request, a preview build is performed after running tests.

In Pull Requests, you may see a comment which reads "🚀 Expo preview is ready!" along with a QR code. To use this QR code to preview changes, install the [Expo Go](https://expo.dev/expo-go) app on one of your mobile devices:

- https://expo.dev/expo-go

These previews are built and deployed to [the `mozilla-ocho-hey` EAS account](https://expo.dev/accounts/mozilla-ocho-h3y) via this GitHub Action:

- [expo-pr-preview.yml](../.github/workflows/expo-pr-preview.yml)


## App Store Connect

[App Store Connect](https://appstoreconnect.apple.com/) is the management portal for all apps. You'll need [an Apple Developer Account in the Mozilla team](./development.md) to access the portal.

Our app can be found here:

- https://appstoreconnect.apple.com/apps/6468680088/appstore/ios/version/inflight

From there, you can view builds uploaded from BitRise, manage TestFlight release, and manage nearly everything else related to the app for the App Store.

However, some aspects of the app are managed by Mozilla Release Engineering. If the app name or some other basic piece of metadata needs to change, you may need to file a bug here:

- https://bugzilla.mozilla.org/enter_bug.cgi?product=Release+Engineering&component=General

## Shipping to TestFlight

Shipping to TestFlight basically consists of manually selecting an uploaded build and releasing it to a testing group in App Store Connect.

Builds should be performed & uploaded via Bitrise upon pushes to the `main` branch, so this part should be automated.

## Shipping a new version

TBD