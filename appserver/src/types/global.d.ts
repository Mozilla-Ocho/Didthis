// just primitive types here, no need to use these strictly but it's
// descriptive to use named types for key data when possible. {{{
type ApiUserId = string
type ApiPostId = string
type ApiProjectId = string
type ApiTimestamp = number // epoch seconds integer
// }}}
type ApiProjectStatus = 'active' | 'complete' | 'paused'
type ApiScope = 'public' | 'private'
type ApiUrlMeta = {
  host: string
  title: string
  imageUrl: string
}

type ApiUser = {
  id: ApiUserId
  email: string
  urlSlug: string
  profile: ApiProfile
  createdAt: number
  fullName?: string
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
  url_slug: string
  profile: ApiProfile
  created_at_millis: number
  updated_at_millis: number
  full_name: string | null
  signup_code_name: string | null
  admin_status: string | null
  ban_status: string | null
  last_write_from_user: number | null
  last_read_from_user: number | null
}

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
}

type ApiProfile = {
  name?: string
  bio?: string
  imageAssetId?: string
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
