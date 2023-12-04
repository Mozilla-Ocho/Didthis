const branding = {
  productName: 'Didthis',
  pageTitle: (x?: string | undefined) => (x ? x + ' | ' : '') + branding.productName,
  loginButtonTxt: 'Sign in',
  signupButtonTxt: 'Get started',
  claimAccountButtonTxt: 'Sign up',
  supportEmail: 'didthis@mozilla.com',
}

export default branding
