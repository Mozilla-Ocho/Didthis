import normalizeUrl from 'normalize-url'

// a bunch of helpers for ApiProfile POJOs
const normalizeUrlConfig = {
  // we're not using normalizeUrl to strip down urls to their essentials, we
  // are using it as a user input parser that is more lenient than URL() lib.
  // for example you can give it 'twitter.com/foo' and it will return
  // 'https://twitter.com/foo' where URL() would throw an error.
  defaultProtocol: 'https' as const,
  removeTrailingSlash: false,
  removeSingleSlash: false,
  stripTextFragment: false,
  stripAuthentication: false,
  stripHash: false,
  stripProtocol: false,
  stripWWW: false,
  removeDirectoryIndex: false,
  sortQueryParameters: false,
}

const maxChars = {
  name: 50,
  imageAssetId: 100,
  url: 300,
  title: 140,
  blurb: 1000,
  slug: 50,
}

const minChars = {
  slug: 3,
}

const mkDefaultProfile = () => {
  return {
    projects: {},
  } as ApiProfile
}

const filteredImageMeta = (
  meta: CldImageMetaPrivate | CldImageMetaPublic | undefined
): CldImageMetaPublic | undefined => {
  if (meta) {
    return {
      metaOrigin: 'filtered',
      width: meta.width,
      height: meta.height,
      format: meta.format,
    }
  } else return undefined
}

const privacyFilteredCopy = (original: ApiProfile): ApiProfile => {
  const filtered = mkDefaultProfile()
  filtered.name = original.name
  filtered.bio = original.bio
  filtered.imageAssetId = original.imageAssetId
  filtered.imageMeta = filteredImageMeta(original.imageMeta)
  filtered.projects = {}
  Object.values(original.projects || {}).forEach(origProj => {
    if (origProj.scope === 'public') {
      const proj = JSON.parse(JSON.stringify(origProj)) as ApiProject
      Object.keys(proj.posts).forEach(pid => {
        if (proj.posts[pid].scope !== 'public') {
          delete proj.posts[pid]
        }
        proj.posts[pid].imageMeta = filteredImageMeta(proj.posts[pid].imageMeta)
      })
      proj.imageMeta = filteredImageMeta(proj.imageMeta)
      filtered.projects[proj.id] = proj
    }
  })
  return filtered
}

const getParsedUrl = (url: string, strict?: boolean): URL | false => {
  let parsedUrl
  try {
    let processedUrl = url
    if (!strict) {
      // this might throw an error but is more lenient than URL lib
      processedUrl = normalizeUrl(url, normalizeUrlConfig)
    }
    // this can also throw an error and is strict
    parsedUrl = new URL(processedUrl)
    if (parsedUrl.protocol !== 'https:' && parsedUrl.protocol !== 'http:') {
      throw new Error('url scheme not allowed')
    }
    if (parsedUrl.username || parsedUrl.password) {
      throw new Error('auth on urls not allowed')
    }
  } catch (e) {
    // any error from normalizeUrl, new URL(), or our own rules
    return false
  }
  return parsedUrl
}

const generateRandomAvailablePostId = (profile: ApiProfile): string => {
  const mkRandId = () => {
    const chars = 'bcdfghjkmnpqrstvwxyz23456789'
    let pid = ''
    for (let i = 0; i < 5; i++) {
      pid = pid + chars[Math.floor(Math.random() * chars.length)]
    }
    return pid
  }
  let available = false
  let pid = mkRandId()
  while (!available) {
    const existing = Object.values(profile.projects).find(proj =>
      Object.values(proj.posts).find(post => post.id === pid)
    )
    if (existing) {
      pid = mkRandId()
    } else {
      available = true
    }
  }
  return pid
}

const generateRandomAvailableProjectId = (profile: ApiProfile): string => {
  const mkRandId = () => {
    const chars = 'bcdfghjkmnpqrstvwxyz23456789'
    let pid = ''
    for (let i = 0; i < 5; i++) {
      pid = pid + chars[Math.floor(Math.random() * chars.length)]
    }
    return pid
  }
  let available = false
  let pid = mkRandId()
  while (!available) {
    const existing = Object.values(profile.projects).find(p => p.id === pid)
    if (existing) {
      pid = mkRandId()
    } else {
      available = true
    }
  }
  return pid
}

const mkNewProject = (
  profile: ApiProfile
): { profile: ApiProfile; projectId: string; project: ApiProject } => {
  // DRY_20466 new project defaults
  const projectId = generateRandomAvailableProjectId(profile)
  let i = 1
  Object.values(profile.projects).forEach(proj => {
    if (proj.title.trim().match(/^Untitled Project( \d+)?$/)) {
      const num = proj.title.split(/ +/)[2] || '1'
      if (num) i = Math.max(parseInt(num, 10) + 1, i)
    }
  })
  const counter = i > 1 ? ' ' + i : ''
  const millis = new Date().getTime()
  const project: ApiProject = {
    id: projectId,
    title: 'Untitled Project' + counter,
    createdAt: millis,
    updatedAt: millis,
    currentStatus: 'active',
    scope: 'private',
    posts: {},
  }
  profile.projects[project.id] = project
  return { profile, projectId, project }
}

const slugStringValidation = (
  slug: string
): { valid: true } | { valid: false; error: SlugError } => {
  if (typeof slug !== 'string')
    return {
      valid: false,
      error: 'ERR_SLUG_CHARS',
    }
  slug = slug.trim()
  // for invalid chars regexp, use * not + because we don't want to return
  // invalid chars on an empty string
  if (!slug.match(/^[a-zA-Z0-9_\-]*$/))
    return {
      valid: false,
      error: 'ERR_SLUG_CHARS',
    }
  if (slug.length < minChars.slug)
    return {
      valid: false,
      error: 'ERR_SLUG_TOO_SHORT',
    }
  if (slug.length > maxChars.slug)
    // DRY_35120 slug max chars
    return {
      valid: false,
      error: 'ERR_SLUG_TOO_LONG',
    }
  return { valid: true }
}

const hasAnySocialUrls = (profile: ApiProfile) => {
  if (!profile.socialUrls) return false
  return !!(
    profile.socialUrls.twitter ||
    profile.socialUrls.facebook ||
    profile.socialUrls.reddit ||
    profile.socialUrls.instagram
  )
}

const profileUtils = {
  mkDefaultProfile,
  privacyFilteredCopy,
  getParsedUrl,
  maxChars,
  minChars,
  mkNewProject,
  generateRandomAvailablePostId,
  slugStringValidation,
  hasAnySocialUrls,
}

export default profileUtils
