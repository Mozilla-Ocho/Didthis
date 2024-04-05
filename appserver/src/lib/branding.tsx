const branding = {
  productName: 'Didthis',
  pageTitle: (x?: string | undefined) => (x ? x + ' | ' : '') + branding.productName,
  loginButtonTxt: 'Sign in',
  signupButtonTxt: 'Get started',
  claimAccountButtonTxt: 'Sign up',
  supportEmail: 'didthis@mozilla.com',
  testflightURL: 'https://testflight.apple.com/join/y5IlSCsD',
  iOSAppStoreURLHomeUnauth: 'https://apps.apple.com/app/apple-store/id6468680088?pt=373246&ct=ddths-web-hp&mt=8',
  iOSAppStoreURLAuthed: 'https://apps.apple.com/app/apple-store/id6468680088?pt=373246&ct=ddths-web-auth&mt=8',
  discordURL: "https://discord.gg/Z9f8UjdfJx",
}

export default branding
