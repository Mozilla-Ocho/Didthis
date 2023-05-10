const clientAppPaths = {
  afterLogout: '/',
  getYourOwn: '/',
  userHomepage: '/:urlSlug',
  userHomepageUrlForSlug: slug => process.env.REACT_APP_API_ENDPOINT + '/' + encodeURI(slug),
  amplitudeProxy: process.env.REACT_APP_API_ENDPOINT + '/amplitude',
  // DRY_65823 feedback url
  feedbackFormPath: 'https://survey.alchemer.com/s3/7138935/Graceland-MVP-feedback',
  termsPath: 'terms', // DRY_35079 terms path
  privacyPolicyPath: 'privacy', // DRY_35079 privacy policy path
  acceptableUsePath: 'acceptable-use' // DRY_35079 acceptable use path
}

export { clientAppPaths }

