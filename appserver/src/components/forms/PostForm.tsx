import { observer } from 'mobx-react-lite'
import { useStore } from '@/lib/store'
import { useCallback, useState } from 'react'
import { Button, Input, Select, Textarea, CloudinaryImage } from '../uiLib'
import { useRouter } from 'next/router'
import { getParamString } from '@/lib/nextUtils'
import pathBuilder from '@/lib/pathBuidler'
import { makeAutoObservable, action } from 'mobx'
import { debounce } from 'lodash-es'
import apiClient from '@/lib/apiClient'
import log from '@/lib/log'
import { ApiError } from '@/lib/apiCore'
import LinkPreview from '../LinkPreview'
import ImageUpload from '../ImageUpload'
import type { UploadCallback } from '../ImageUpload'
import profileUtils from '@/lib/profileUtils'

class PostStore {
  id: string
  description: string
  // for MVP we are not giving user control over visibility at a post-level,
  // only the project level, and posts in a project are assumed public so
  // they all show up externally if the project is public.
  scope: ApiScope
  projectId: ApiProjectId
  linkUrl: string
  fetchingUrl = ''
  fetching = false
  imageAssetId: string
  imageMeta: CldImageMetaAny | CldImageMetaPublic | undefined
  error: UrlMetaError = false
  urlMeta: ApiUrlMeta | false
  fetchUrlMetaAndUpdateDebounced: () => void

  constructor(
    mode: 'edit' | 'new',
    defaultPid: ApiProjectId,
    post: ApiPost | undefined
  ) {
    if (mode === 'new') {
      this.id = 'new' // assigned on save
      this.projectId = defaultPid // assigned on save if "new"
      this.description = ''
      this.scope = 'public'
      this.linkUrl = ''
      this.imageAssetId = ''
      this.urlMeta = false
      this.imageMeta = undefined
    } else if (post) {
      this.id = post.id
      this.projectId = post.projectId
      this.description = post.description || ''
      this.scope = post.scope
      this.linkUrl = post.linkUrl || ''
      this.imageAssetId = post.imageAssetId || ''
      this.imageMeta = post.imageMeta
      this.urlMeta = post.urlMeta || false
    } else {
      throw new Error(
        'post store must be initialized with "new", or "edit" and an api post obj'
      )
    }
    this.fetchUrlMetaAndUpdateDebounced = debounce(
      this.fetchUrlMetaAndUpdate,
      1000,
      {
        // leading=true because i assume they'll copy+paste the url in one event, so
        // start right away
        leading: true,
      }
    )
    makeAutoObservable(this, {
      fetchUrlMetaAndUpdateDebounced: false,
    })
  }

  getApiPost(): ApiPost {
    return {
      id: this.id,
      createdAt: 0, // ignored / assigned at backend
      updatedAt: 0, // ignored / assigned at backend
      projectId: this.projectId,
      scope: this.scope,
      description: this.description.trim(),
      imageAssetId: this.imageAssetId || undefined,
      imageMeta: this.imageMeta,
      linkUrl:
        this.linkUrl && this.linkUrl.trim() ? this.linkUrl.trim() : undefined,
      urlMeta: this.urlMeta ? this.urlMeta : undefined,
    }
  }

  get linkUrlIsInvalid() {
    // true if we should show a validation error on the link
    if (this.linkUrl.trim()) {
      const parsed = profileUtils.getParsedUrl(this.linkUrl)
      return parsed === false
    } else {
      return false
    }
  }

  get isPostable() {
    if (this.linkUrlIsInvalid) return false
    const hasText = !!this.description.trim()
    const hasUrl = !!this.linkUrl.trim()
    const hasImage = !!this.imageAssetId.trim()
    return (hasText || hasUrl || hasImage)
  }

  setDescription(x: string) {
    this.description = x
  }
  setProjectId(x: string) {
    this.projectId = x
  }
  setScope(x: ApiScope) {
    this.scope = x
  }
  setImageAssetId(assetId: string, meta: CldImageMetaAny | undefined) {
    this.imageAssetId = assetId
    this.imageMeta = meta
  }
  setUrlWithSideEffects(x: string) {
    this.linkUrl = x
    this.fetchUrlMetaAndUpdateDebounced()
  }

  fetchUrlMetaAndUpdate(): void {
    const url = this.linkUrl
    if (url.trim() === '') {
      this.fetching = false
      this.fetchingUrl = ''
      this.error = false
      this.urlMeta = false
      return
    }
    const parsedUrl = profileUtils.getParsedUrl(url)
    if (!parsedUrl) {
      this.fetching = false
      this.fetchingUrl = ''
      this.error = 'bad_url'
      this.urlMeta = false
      return
    }
    this.fetchingUrl = parsedUrl.toString()
    this.fetching = true
    apiClient
      .getUrlMeta({ url: parsedUrl.toString() })
      .then(
        action(wrapper => {
          this.fetchingUrl = ''
          this.fetching = false
          this.error = false
          this.urlMeta = wrapper.payload.urlMeta
        })
      )
      .catch(err => {
        log.error('error fetching url', { url, err })
        this.error = 'other'
        if (err instanceof ApiError) {
          if (err.apiInfo?.errorId === 'ERR_BAD_INPUT') {
            this.error = 'bad_url'
          }
          if (err.apiInfo?.errorId === 'ERR_REMOTE_FETCH_FAILED') {
            this.error = 'remote_fetch'
          }
        }
        this.urlMeta = false
      })
  }
}

const ProjectSelector = observer(({ postStore }: { postStore: PostStore }) => {
  const store = useStore()
  if (!store.user) return <></>
  const profile = store.user.profile
  const handleChangeProject = (e: React.ChangeEvent<HTMLSelectElement>) => {
    postStore.setProjectId(e.target.value)
  }
  if (!store.user) return <></>
  const nameAndId: [string, string][] = []
  Object.values(profile.projects).forEach(proj => {
    nameAndId.push([proj.title, proj.id])
  })
  nameAndId.sort((a, b) => {
    return profile.projects[a[1]].createdAt - profile.projects[b[1]].createdAt
  })
  nameAndId.unshift(['Create a new project', 'new'])
  return (
    <div>
      <p>Project:</p>
      <Select onChange={handleChangeProject} value={postStore.projectId}>
        {nameAndId.map(nid => (
          <option key={nid[1]} value={nid[1]}>
            {nid[0]}
          </option>
        ))}
      </Select>
    </div>
  )
})

const DescriptionField = observer(({ postStore }: { postStore: PostStore }) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    postStore.setDescription(e.target.value)
  }
  return (
    <>
      <label>
        description:
        <Textarea
          placeholder="Write your update here..."
          name="description"
          value={postStore.description}
          onChange={handleChange}
        />
      </label>
    </>
  )
})

const LinkField = observer(({ postStore }: { postStore: PostStore }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    postStore.setUrlWithSideEffects(e.target.value)
  }
  return (
    <>
      <label>
        link:
        <Input
          type="text"
          name="linkUrl"
          value={postStore.linkUrl}
          onChange={handleChange}
        />
        <LinkPreview
          loading={postStore.fetching}
          error={postStore.error}
          urlMeta={postStore.urlMeta}
          linkUrl={postStore.linkUrl}
        />
        <p>fetching: {JSON.stringify(postStore.fetching)}</p>
        <p>urlMeta: {JSON.stringify(postStore.urlMeta)}</p>
        <p>error: {JSON.stringify(postStore.error)}</p>
      </label>
    </>
  )
})

const ImageField = observer(({ postStore }: { postStore: PostStore }) => {
  const onResult = useCallback(
    res => {
      postStore.setImageAssetId(res.cloudinaryAssetId, res.info)
    },
    [postStore]
  ) as UploadCallback
  const deleteImage = () => {
    postStore.setImageAssetId('', undefined)
  }
  return (
    <div>
      {postStore.imageAssetId && (
        <CloudinaryImage assetId={postStore.imageAssetId} intent="post" />
      )}
      <ImageUpload intent="post" onUploadWithUseCallback={onResult} />
      {postStore.imageAssetId && <Button onClick={deleteImage}>remove</Button>}
    </div>
  )
})

type Props = { mode: 'new' } | { mode: 'edit'; post: ApiPost }

const PostForm = observer((props: Props) => {
  const { mode } = props
  const router = useRouter()
  const store = useStore()
  if (!store.user) return <></>
  let defaultPid = getParamString(router, 'projectId')
  if (mode === 'new' && !store.user.profile.projects[defaultPid])
    defaultPid = 'new'
  const [postStore] = useState(
    () =>
      new PostStore(mode, defaultPid, mode === 'edit' ? props.post : undefined)
  )
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    store.savePost(postStore.getApiPost()).then(newPost => {
      if (!store.user) return
      console.log('ok done', newPost)
      router.push(
        pathBuilder.post(store.user.urlSlug, newPost.projectId, newPost.id)
      )
    })
  }
  return (
    <div>
      <form onSubmit={handleSubmit} method="POST">
        <label>post content:</label>
        <ProjectSelector postStore={postStore} />
        <DescriptionField postStore={postStore} />
        <ImageField postStore={postStore} />
        <LinkField postStore={postStore} />
        <Button type="submit" disabled={!postStore.isPostable}>
          {mode === 'new' ? 'POST' : 'SAVE'}
        </Button>
      </form>
    </div>
  )
})

export default PostForm
