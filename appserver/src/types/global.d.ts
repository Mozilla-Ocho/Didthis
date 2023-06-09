type ProjectStatus = 'active' | 'complete' | 'paused'
type Scope = 'public' | 'private'
type Timestamp = number // epoch seconds integer
type UrlMeta = {
  host: string
  title: string
  imageUrl: string
}

type ApiUser = {
  id: string
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
  id: string
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
  id: string
  projectId: string
  createdAt: Timestamp
  updatedAt: Timestamp
  scope: Scope
  description?: string
  linkUrl?: string
  urlMeta?: UrlMeta
  imageAssetId?: string
}

type ApiProject = {
  id: string
  createdAt: Timestamp
  updatedAt: Timestamp
  title: string
  scope: Scope
  currentStatus: ProjectStatus
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
