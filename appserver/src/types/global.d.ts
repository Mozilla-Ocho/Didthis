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

type ApiUser = {
  id: ApiUserId
  email: string
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
  isBanned?: true
  lastFullPageLoad?: number
  lastWrite?: number
  updatedAt?: number
}

interface UserDbRow {
  id: ApiUserid
  email: string
  system_slug: string
  user_slug: string | null
  user_slug_lc: string | null
  profile: ApiProfile
  created_at_millis: number
  updated_at_millis: number
  signup_code_name: string | null
  admin_status: string | null
  ban_status: string | null
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
 * images, which includes things like the original dimensions, format, etc */
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
type CldImageMetaPrivate = {[key:string]: any} & {metaOrigin: 'private' }
// for imageMeta on link previews, metaOrigin is "urlMeta" and contains the
// whole payload but doesn't need to be filtered.
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
type CldImageMetaUrl = {[key:string]: any} & {metaOrigin: 'urlMeta'}
type CldImageMetaAny = CldImageMetaPublic | CldImageMetaPrivate | CldImageMetaUrl

type ApiPost = {
  id: ApiPostId
  projectId: ApiProjectId
  createdAt: ApiTimestamp
  updatedAt: ApiTimestamp
  scope: ApiScope
  description?: string
  linkUrl?: string
  urlMeta?: ApiUrlMeta
  imageAssetId?: string
  imageMeta?: CldImageMetaPrivate | CldImageMetaPublic
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
}

type ApiSocialUrls = {
  twitter?: string,
  reddit?: string,
  facebook?: string,
  instagram?: string,
}

type ApiProfile = {
  name?: string
  bio?: string
  socialUrls?: ApiSocialUrls
  imageAssetId?: string
  imageMeta?: CldImageMetaPrivate | CldImageMetaPublic
  projects: { [key: string]: ApiProject }
}

type EventSpec = {
  eventName: string
  key: string
  opts: {
    name?: string
    isAuthed?: 'y' | 'n'
    isSelfView?: 'y' | 'n'
    signupCodeName?: string
    id?: string
    newProject?: 'y' | 'n'
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

