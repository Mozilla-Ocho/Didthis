// just primitive types here, no need to use these strictly but it's
// descriptive to use named types for key data when possible. {{{
type ApiUserId = string
type ApiPostId = string
type ApiProjectId = string
type ApiTimestamp = number // epoch milliseconds integer
// }}}
type ApiProjectStatus = 'active' | 'complete' | 'paused'
type ApiScope = 'public' | 'private'
type ApiUrlMeta = {
  host: string
  title: string
  imageUrl: string
  imageMeta?: CldImageMetaUrl
}

type ApiSignupCodeInfo = {
  active: boolean;
  value: string;
  name: string;
  envNames: string[]
}

type ApiUser = {
  id: ApiUserId
  email?: string // not present on public records
  // use systemSlug for editing/writes/forms because it's stable
  systemSlug: string
  // use userSlug when linking to the page in a way that could be shared/public
  userSlug?: string
  // publicPageSlug is a shortcut for (userSlug || systemSlug)
  publicPageSlug: string
  profile: ApiProfile
  createdAt: number
  signupCodeName?: string
  unsolicited?: true
  isAdmin?: true
  isFlagged?: true
  isTrial?: boolean
  lastFullPageLoad?: number
  lastWrite?: number
  updatedAt?: number
  // true if the user being returned was created/added to the db in the request
  justCreated?: boolean
}

interface UserDbRow { // for reads (numbers are strings)
  id: ApiUserid
  email: string
  system_slug: string
  user_slug: string | null
  user_slug_lc: string | null
  profile: ApiProfile
  created_at_millis: string
  updated_at_millis: string
  signup_code_name: string | null
  admin_status: 'admin' | null
  ban_status: 'flagged' | null
  trial_status?: boolean
  last_write_from_user: string | null
  last_read_from_user: string | null
}
interface UserDbRowForWrite { // for writes (numbers are numbers)
  // because knex (or the postgres lib underneath) is asymmetrical with respect
  // to number values in the db columns. you write them as numbers, but they
  // come back as strings on reads, presumably because it's trying to avoid
  // overflows/corruption for large numbers that the db could potentially
  // represent but javscript can't?
  id: ApiUserid
  email: string | null
  system_slug: string
  user_slug: string | null
  user_slug_lc: string | null
  profile: ApiProfile
  created_at_millis: number
  updated_at_millis: number
  signup_code_name: string | null
  admin_status: 'admin' | null
  ban_status: 'flagged' | null
  trial_status?: boolean
  last_write_from_user: number | null
  last_read_from_user: number | null
}

// on publicly returned data for user image uploads, we restrict the image meta
// to these properties:
type CldImageMetaPublic = {
  metaOrigin: 'filtered',
  width: number,
  height: number,
  format: string,
}
/* we're going to capture whatever object metadata cloudinary returns with
 * images, which includes things like the original dimensions, format, exif
 * metadat if any, etc */
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
type CldImageMetaPrivate = {[key:string]: any} & {metaOrigin: 'private' }
// for imageMeta on link previews, metaOrigin is "urlMeta" and contains the
// whole payload but doesn't need to be filtered.
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
type CldImageMetaUrl = {[key:string]: any} & {metaOrigin: 'urlMeta'}
type CldImageMetaAny = CldImageMetaPublic | CldImageMetaPrivate | CldImageMetaUrl

type AppPlatformType = 'web' | 'web-desktop' | 'web-mobile' | 'native-ios'
type AuthMethodType = 'email' | 'apple' | 'trial'

type ApiPost = {
  id: ApiPostId
  projectId: ApiProjectId
  createdAt: ApiTimestamp
  didThisAt: ApiTimestamp
  updatedAt: ApiTimestamp
  scope: ApiScope
  description?: string
  linkUrl?: string
  urlMeta?: ApiUrlMeta
  imageAssetId?: string
  imageMeta?: CldImageMetaPrivate | CldImageMetaPublic
  autoShare?: boolean
  createdPlatform?: AppPlatformType
}

type ApiProject = {
  id: ApiProjectId
  createdAt: ApiTimestamp
  updatedAt: ApiTimestamp
  title: string
  scope: ApiScope
  currentStatus: ApiProjectStatus
  posts: { [key: string]: ApiPost }
  description?: string
  imageAssetId?: string
  imageMeta?: CldImageMetaPrivate | CldImageMetaPublic
  shareByDefault?: boolean
  createdPlatform?: AppPlatformType
}

type ApiSocialUrls = {
  twitter?: string,
  reddit?: string,
  facebook?: string,
  instagram?: string,
}

type ApiConnectedAccounts = {
  discord?: DiscordAccount
}

type DiscordAccount = {
  id: string
  username: string
  email?: string
  avatar: string
  discriminator: string
  globalName: string
  accessToken?: string
  refreshToken?: string
  expiresIn?: number
  shareByDefault?: boolean
}

type ApiProfile = {
  name?: string
  bio?: string
  socialUrls?: ApiSocialUrls
  imageAssetId?: string
  imageMeta?: CldImageMetaPrivate | CldImageMetaPublic
  updatedAt: number // updated when user account details are modified (not projects)
  projects: { [key: string]: ApiProject }
  connectedAccounts?: ApiConnectedAccounts
  createdPlatform?: AppPlatformType
  createdAuthMethod?: AuthMethodType
}

type PostMediaType = 'text' | 'image' | 'link'

type YorN = 'y' | 'n'

type EventSpec = {
  eventName: string
  key: string
  opts: {
    name?: string
    isAuthed?: YorN
    authMethod?: AuthMethodType
    appPlatform?: AppPlatformType
    screenSize?: '' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
    slug?: string
    signupCodeName?: string
    id?: string
    newProject?: YorN
    mediaType?: PostMediaType
    fromPage?: string // for buttons/actions that might be on various pages
    direction?: 'asc' | 'desc'
    imgIntent?: CldImageIntent,
    asPartOfNewPost?: YorN
    targetUserSlug?: string
    topicBucket?: string,
    inTrial?: YorN,
    loseTrialWork?: YorN,
    numProjects?: number,
    numPosts?: number,
    fromNativeTopNav?: YorN,
  }
}

type JSONABLE =
  | undefined
  | boolean
  | string
  | number
  | { [key: string]: JSONABLE }
  | Array<JSONABLE>

type POJO = { [key: string]: JSONABLE }

type KvString = { [key: string]: string }

type CldImageIntent = 'avatar' | 'post' | 'project'

type UrlMetaError =  false | 'bad_url' | 'remote_fetch' | 'other'

type SlugError = 'ERR_SLUG_CHARS' | 'ERR_SLUG_TOO_SHORT' | 'ERR_SLUG_TOO_LONG' | 'ERR_SLUG_UNAVAILABLE'

type SlugCheck = {
  value: string,
  available: boolean,
  valid: boolean,
  errorConst?: SlugError,
}

// DRY_51323 testBuckets contents
type TestBucket = {
  version: number,
  value: number,
}


