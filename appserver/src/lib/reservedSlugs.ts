// these + anything are not allowed. case insensitive
const disallowedPrefixes = `
  admin
`
  .trim()
  .toLowerCase()
  .split(/\s+/)

// these by themselves are not allowed. case insensitive
const disallowedValues = `

  about
  aboutus
  team
  staff
  help
  faq
  contact
  support
  email
  press
  news
  recent
  announcement
  announcements

  legal
  policy
  privacy
  term
  terms

  login
  logout
  signin
  signout

  auth
  user
  profile

  official
  moz
  mozilla
  firefox
  mdn

  pub
  public

  img
  image
  images

  ass
  asset
  assets

  static

  share
  shared

  dev
  developer

  api
  edit
  rest
  post
  get
  put
  patch

  example
  examples

  ref
  reference

  rel
  relative

  aaa
  abc
  moz
  xyz
  zzz

  track
  tracking
  amp
  amplitude

  evt
  event
  events

`
  .trim()
  .toLowerCase()
  .split(/\s+/)

// TODO: more validation

function isReserved(slug: string): 'prefix' | 'value' | false {
  slug = slug.trim()
  for (const prefix of disallowedPrefixes) {
    if (slug.toLowerCase().indexOf(prefix) === 0) {
      return 'prefix'
    }
  }
  for (const value of disallowedValues) {
    if (slug.toLowerCase() === value) return 'value'
  }
  return false
}

export { isReserved }
