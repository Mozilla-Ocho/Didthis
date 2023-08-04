const branding = {
  productName: 'Didthis',
  pageTitle: (x?: string | undefined) => (x ? x + ' | ' : '') + branding.productName,
  loginButtonTxt: 'Sign in',
  signupButtonTxt: 'Get started',
}

export default branding
