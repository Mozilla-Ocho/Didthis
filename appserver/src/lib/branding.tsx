const branding = {
  productName: 'Didthis',
  pageTitle: (x?: string | undefined) => (x ? x + ' | ' : '') + branding.productName,
  loginButtonTxt: 'Sign in',
  signupButtonTxt: 'Get started',
  claimAccountButtonTxt: 'Sign up',
  supportEmail: 'didthis@mozilla.com',
  testflightURL: 'https://testflight.apple.com/join/y5IlSCsD',
  iOSAppStoreURL: 'https://apps.apple.com/us/app/mozilla-didthis/id6468680088',
}

export default branding
