const branding = {
  productName: 'Didthis',
  pageTitle: (x?: string | undefined) => (x ? x + ' | ' : '') + branding.productName,
  loginButtonTxt: 'Sign in',
  signupButtonTxt: 'Get started',
  claimAccountButtonTxt: 'Claim account'
}

export default branding
