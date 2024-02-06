import { observer } from 'mobx-react-lite'
import { useStore } from '@/lib/store'
import { MouseEventHandler, useCallback, useEffect, useState } from 'react'
import {
  Button,
  Input,
  Select,
  Textarea,
  CloudinaryImage,
  Timestamp,
} from '../uiLib'
import { useRouter } from 'next/router'
import { getParamString } from '@/lib/nextUtils'
import pathBuilder from '@/lib/pathBuilder'
import { makeAutoObservable, action } from 'mobx'
import { debounce } from 'lodash-es'
import apiClient from '@/lib/apiClient'
import log from '@/lib/log'
import { ApiError } from '@/lib/apiCore'
import LinkPreview from '../LinkPreview'
import ImageUploadWeb from '../ImageUpload'
import ImageUploadAppShell from '../ImageUploadAppShell'
import type { UploadCallback } from '../ImageUpload'
import profileUtils from '@/lib/profileUtils'
import { twMerge } from 'tailwind-merge'
import { trackingEvents } from '@/lib/trackingEvents'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import dayjs, { Dayjs } from 'dayjs'
import { getExifCreatedAtMillis } from '@/lib/cloudinaryConfig'
import useAppShell, { useAppShellTopBar } from '@/lib/appShellContent'

class PostStore {
  id: string
  description: string
  // for MVP we are not giving user control over visibility at a post-level,
  // only the project level, and posts in a project are assumed public so
  // they all show up externally if the project is public.
  scope: ApiScope
  projectId: ApiProjectId
  project: ApiProject | null
  editedPost: ApiPost | null
  mediaType: PostMediaType = 'image'
  linkUrl: string
  linkTouched = false
  fetchingUrl = ''
  fetching = false
  imageAssetId: string
  imageMeta: CldImageMetaPrivate | CldImageMetaPublic | undefined
  error: UrlMetaError = false
  urlMeta: ApiUrlMeta | false
  fetchUrlMetaAndUpdateDebounced: () => void
  spinning = false
  didThisAtFormValue: Dayjs | null = null // for the controlled mui element
  autoShare: boolean

  constructor(
    mode: 'edit' | 'new',
    project: ApiProject | undefined,
    defaultPid: ApiProjectId,
    post: ApiPost | undefined
  ) {
    if (mode === 'new') {
      this.id = 'new' // assigned on save
      this.projectId = defaultPid // assigned on save if "new"
      this.project = project || null
      this.editedPost = null
      this.description = ''
      this.scope = 'public'
      this.linkUrl = ''
      this.imageAssetId = ''
      this.urlMeta = false
      this.imageMeta = undefined
      this.autoShare = project?.shareByDefault !== false
    } else if (post) {
      this.mediaType = 'text'
      this.id = post.id
      this.projectId = post.projectId
      this.project = null
      this.editedPost = post
      this.description = post.description || ''
      this.scope = post.scope
      this.linkUrl = post.linkUrl || ''
      this.linkTouched = !!this.linkUrl.trim()
      if (this.linkTouched) this.mediaType = 'link'
      this.imageAssetId = post.imageAssetId || ''
      this.imageMeta = post.imageMeta
      this.urlMeta = post.urlMeta || false
      if (this.imageAssetId) this.mediaType = 'image'
      this.didThisAtFormValue = dayjs(post.didThisAt)
      this.autoShare = !!post.autoShare
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
      didThisAt: this.didThisAtFormValue
        ? this.didThisAtFormValue.valueOf()
        : 0,
      updatedAt: 0, // ignored / assigned at backend
      projectId: this.projectId,
      scope: this.scope,
      autoShare: this.autoShare,
      description: this.description.trim(),
      imageAssetId:
        this.mediaType === 'image' ? this.imageAssetId || undefined : undefined,
      imageMeta: this.mediaType === 'image' ? this.imageMeta : undefined,
      linkUrl:
        this.mediaType === 'link' && this.linkUrl && this.linkUrl.trim()
          ? this.linkUrl.trim()
          : undefined,
      urlMeta:
        this.mediaType === 'link' && this.urlMeta ? this.urlMeta : undefined,
    }
  }

  linkUrlIsInvalid() {
    // true if we should show a validation error on the link
    if (this.linkUrl.trim()) {
      const parsed = profileUtils.getParsedUrl(this.linkUrl)
      return parsed === false
    } else {
      return false
    }
  }

  dateTimeIsInvalid() {
    const nowMillis = new Date().getTime()
    if (!this.didThisAtFormValue) return false
    if (this.didThisAtFormValue.valueOf() > nowMillis) {
      return true
    }
    return false
  }

  isPostable() {
    // XXX length validations
    const hasText = !!this.description.trim()
    const hasUrl = !!this.linkUrl.trim()
    const hasImage = !!this.imageAssetId.trim()
    const descOver =
      this.description.trim().length > profileUtils.maxChars.blurb
    const linkOver = this.linkUrl.trim().length > profileUtils.maxChars.url
    if (descOver) return false
    if (this.mediaType === 'link') {
      if (this.linkUrlIsInvalid()) return false
      if (linkOver) return false
      return hasUrl
    }
    if (this.mediaType === 'image') {
      return hasImage
    }
    if (this.dateTimeIsInvalid()) return false
    return hasText
  }

  setDescription(x: string) {
    this.description = x
  }
  setProjectId(x: string) {
    this.projectId = x
  }
  setProject(x: ApiProject) {
    this.project = x
  }
  setScope(x: ApiScope) {
    this.scope = x
  }
  setImageAssetId(assetId: string, meta: CldImageMetaPrivate | undefined) {
    this.imageAssetId = assetId
    this.imageMeta = meta
  }
  setUrlWithSideEffects(x: string) {
    this.linkUrl = x
    this.linkTouched = true
    this.fetchUrlMetaAndUpdateDebounced()
  }
  setMediaType(x: PostMediaType) {
    this.mediaType = x
  }
  setDidThisAtDayjs(x: Dayjs | null) {
    this.didThisAtFormValue = x
  }
  setAutoShare(x: boolean) {
    this.autoShare = x
  }
  setSpinning(x: boolean) {
    this.spinning = x
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
        this.fetchingUrl = ''
        this.fetching = false
        this.urlMeta = false
      })
  }
}

const ProjectSelector = observer(({ postStore }: { postStore: PostStore }) => {
  const store = useStore()
  if (!store.user) return <></>
  const profile = store.user.profile
  if (!store.user) return <></>
  const nameAndId: [string, string][] = []
  Object.values(profile.projects).forEach(proj => {
    nameAndId.push([proj.title, proj.id])
  })
  nameAndId.sort((a, b) => {
    return profile.projects[a[1]].createdAt - profile.projects[b[1]].createdAt
  })
  nameAndId.unshift(['Create a new project', 'new'])
  const handleChangeProject = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const projectId = e.target.value
    postStore.setProjectId(projectId)
    postStore.setProject(profile.projects[projectId])
  }
  return (
    <div>
      <label htmlFor="project-selector" className="text-form-labels text-sm">
        Add to which project?
        <Select
          id="project-selector"
          onChange={handleChangeProject}
          value={postStore.projectId}
          className="mt-2 text-bodytext"
        >
          {nameAndId.map(nid => (
            <option key={nid[1]} value={nid[1]}>
              {nid[0]}
            </option>
          ))}
        </Select>
      </label>
      {postStore.projectId === 'new' && (
        <p className="text-sm mt-2 text-form-labels">
          Don’t worry, all projects are private by default! It’s up to you to
          decide if and when you share your work with others.
        </p>
      )}
    </div>
  )
})

const DescriptionField = observer(
  ({ postStore, mode }: { postStore: PostStore; mode: 'new' | 'edit' }) => {
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      postStore.setDescription(e.target.value)
    }
    const hint =
      postStore.mediaType === 'text'
        ? 'Write something...'
        : postStore.mediaType === 'image'
        ? 'Write about this image...'
        : postStore.mediaType === 'link'
        ? 'Write about this link...'
        : ''
    return (
      <>
        <label htmlFor="description-field">
          <span className="sr-only">description:</span>
          <Textarea
            id="description-field"
            placeholder={hint}
            name="description"
            value={postStore.description}
            onChange={handleChange}
            className="text-bodytext"
            touched={true}
            maxLen={profileUtils.maxChars.blurb}
            style={{ minHeight: mode === 'new' ? 141 : 308 }}
          />
        </label>
      </>
    )
  }
)

const LinkField = observer(({ postStore }: { postStore: PostStore }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    postStore.setUrlWithSideEffects(e.target.value)
  }
  return (
    <>
      <LinkPreview
        loading={postStore.fetching}
        error={postStore.error}
        urlMeta={postStore.urlMeta}
        linkUrl={postStore.linkUrl}
      />
      <label htmlFor="linkField">
        <span className="sr-only">link URL:</span>
        <Input
          id="linkField"
          type="text"
          name="linkUrl"
          placeholder="https://..."
          value={postStore.linkUrl}
          onChange={handleChange}
          required
          touched={postStore.linkTouched}
          maxLen={profileUtils.maxChars.url}
        />
      </label>
    </>
  )
})

const ImageField = observer(({ postStore }: { postStore: PostStore }) => {
  const appShell = useAppShell()
  const onResult = useCallback(
    res => {
      postStore.setImageAssetId(res.cloudinaryAssetId, res.imageMetaPrivate)
    },
    [postStore]
  ) as UploadCallback
  const deleteImage = () => {
    postStore.setImageAssetId('', undefined)
  }
  const ImageUpload = appShell.appReady ? ImageUploadAppShell : ImageUploadWeb
  return (
    <div>
      {postStore.imageAssetId && (
        <CloudinaryImage
          assetId={postStore.imageAssetId}
          imageMeta={postStore.imageMeta}
          intent="post"
          className="mb-4"
          lightbox
        />
      )}
      <div className="flex flex-row gap-4 w-full">
        <ImageUpload
          intent="post"
          onUploadWithUseCallback={onResult}
          className="grow"
          isReplace={!!postStore.imageAssetId}
          required
        />
        {postStore.imageAssetId && (
          <Button
            intent="secondary"
            onClick={deleteImage}
            className="grow leading-tight"
            trackEvent={trackingEvents.bcRemoveImage}
            trackEventOpts={{ imgIntent: 'post' }}
          >
            Remove image
          </Button>
        )}
      </div>
    </div>
  )
})

const DateTimeField = observer(({ postStore }: { postStore: PostStore }) => {
  const appShell = useAppShell()

  const handleNativeDateTimePickerOpen: MouseEventHandler<
    HTMLInputElement
  > = async ev => {
    const initialDateTime = postStore.didThisAtFormValue?.toDate().getTime()
    const result = await appShell.api.request('pickDateTime', {
      title: 'Did this when?',
      initialDateTime,
    })
    if (result) {
      const { changed, dateTime } = result
      if (changed) handleChange(dayjs(dateTime))
    }
  }

  const handleChange = (x: Dayjs | null) => {
    postStore.setDidThisAtDayjs(x)
  }
  const [flash, setFlash] = useState(false)
  useEffect(() => {
    if (flash) {
      const timer = setTimeout(() => {
        setFlash(false)
      }, 400)
      return () => {
        clearTimeout(timer)
      }
    }
  }, [flash])
  const err = postStore.dateTimeIsInvalid()
  const exifMillis =
    postStore.mediaType === 'image' && postStore.imageMeta
      ? getExifCreatedAtMillis(postStore.imageMeta)
      : null
  const useTheExif = () => {
    postStore.setDidThisAtDayjs(dayjs(exifMillis))
    setFlash(true)
  }
  const canShowDateTip = !!exifMillis
  const showDateTip =
    canShowDateTip &&
    (!postStore.didThisAtFormValue ||
      postStore.didThisAtFormValue.valueOf() !== exifMillis)
  const tipClasses = showDateTip
    ? 'mt-2 p-4 h-[76px] opacity-100'
    : 'mt-0 px-4 h-0 opacity-0'
  const pickerBgClass = flash ? 'bg-yellow-300' : ''
  return (
    <>
      <label htmlFor="datetime-field" className="text-form-labels text-sm">
        <p>Did this when?</p>
        <div
          className={
            'grid grid-cols-1 transition-colors duration-300 ' + pickerBgClass
          }
        >
          {appShell.appReady ? (
            <Button
              onClick={handleNativeDateTimePickerOpen}
              intent="inputTrigger"
              className="rounded-sm border-form-borders"
            >
              {postStore.didThisAtFormValue?.format('L LT') || 'Now'}
            </Button>
          ) : (
            <DateTimePicker
              className="rounded-sm border-form-borders"
              disableFuture
              label={postStore.didThisAtFormValue === null ? 'now' : ''}
              value={postStore.didThisAtFormValue}
              onChange={handleChange}
            />
          )}
        </div>
        {err && (
          <p className="text-red-400 text-xs text-right">
            Update dates can’t be in the future
          </p>
        )}
        {canShowDateTip && (
          <div
            className={
              'bg-breadcrumbs text-bodytext transition-all duration-500 ' +
              tipClasses
            }
          >
            <p>
              Photo was taken: <Timestamp format="full" millis={exifMillis} />
              <br />
              <Button intent="link" onClick={useTheExif}>
                Use this date instead
              </Button>
            </p>
          </div>
        )}
      </label>
    </>
  )
})

type Props = { project?: ApiProject } & (
  | { mode: 'new' }
  | { mode: 'edit'; post: ApiPost }
)

const PostForm = observer((props: Props) => {
  const { mode, project } = props
  const router = useRouter()
  const store = useStore()
  const appShell = useAppShell()
  if (!store.user) return <></>

  let defaultPid = getParamString(router, 'projectId')
  if (mode === 'new' && store.user && !store.user.profile.projects[defaultPid])
    defaultPid = 'new'
  const [postStore] = useState(
    () =>
      new PostStore(
        mode,
        project,
        defaultPid,
        mode === 'edit' ? props.post : undefined
      )
  )
  const performSubmit = () => {
    // Bail out of submit if already spinning
    if (postStore.spinning) return
    postStore.setSpinning(true)
    store
      .savePost(postStore.getApiPost(), mode, postStore.mediaType)
      .then(newPost => {
        // keep it spinning while next page loads
        // postStore.setSpinning(false)
        if (!store.user) return
        console.log('ok done', newPost)
        router.push(
          pathBuilder.post(store.user.systemSlug, newPost.projectId, newPost.id)
        )
      })
  }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    performSubmit()
  }
  const handleMediaType = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('handleMediaType', e)
    postStore.setMediaType(e.target.value as PostMediaType)
  }
  const labelClass = (t: PostMediaType) => {
    return twMerge(
      'cursor-pointer hover:font-bold text-lg text-black-300',
      postStore.mediaType === t && 'font-bold text-yellow-700'
    )
  }
  const handleCancel = () => {
    store.goBack()
  }
  const setAutoShare = (e: React.ChangeEvent<HTMLInputElement>) => {
    postStore.setAutoShare(e.target.checked)
  }

  // Should show auto-share checkbox if an edited post is recent enough,
  // there's a connected account, and the project is not private
  const maxAutoShareAge = parseInt(
    process.env.NEXT_PUBLIC_DISCORD_BOT_PUBLIC_UPDATES_POST_DELAY || '45000',
    10
  )
  const shouldShowAutoShare =
    (!postStore.editedPost ||
      postStore.editedPost.updatedAt > Date.now() - maxAutoShareAge) &&
    store.user?.profile?.connectedAccounts &&
    postStore.project?.scope !== 'private'

  useAppShellTopBar({
    show: true,
    title: mode === 'new' ? 'Add update' : 'Edit update',
    leftIsBack: true,
    leftLabel: 'Back',
    rightLabel: mode === 'new' ? 'Add' : 'Save',
    rightIsDisabled: !postStore.isPostable(),
    onLeftPress: handleCancel,
    onRightPress: performSubmit,
  })

  if (!store.user) return <></>
  return (
    <div>
      <form
        onSubmit={handleSubmit}
        method="POST"
        className="flex flex-col gap-5"
      >
        {defaultPid === 'new' && <ProjectSelector postStore={postStore} />}
        {mode === 'new' && (
          <div
            className={`grid grid-cols-3 gap-4 text-center ${
              appShell.inAppWebView ? 'mt-4' : 'mt-8'
            }`}
          >
            <label htmlFor="mediaText" className={labelClass('text')}>
              <input
                id="mediaText"
                onChange={handleMediaType}
                className="sr-only"
                type="radio"
                value="text"
                checked={postStore.mediaType === 'text'}
              />
              Text
            </label>
            <label htmlFor="mediaImage" className={labelClass('image')}>
              <input
                id="mediaImage"
                onChange={handleMediaType}
                className="sr-only"
                type="radio"
                value="image"
                checked={postStore.mediaType === 'image'}
              />
              Image
            </label>
            <label htmlFor="mediaLink" className={labelClass('link')}>
              <input
                id="mediaLink"
                onChange={handleMediaType}
                className="sr-only"
                type="radio"
                value="link"
                checked={postStore.mediaType === 'link'}
              />
              Link
            </label>
          </div>
        )}
        {mode === 'edit' && !appShell.inAppWebView && <div className="p-1" />}
        {postStore.mediaType === 'image' && (
          <ImageField postStore={postStore} />
        )}
        {postStore.mediaType === 'link' && <LinkField postStore={postStore} />}
        <DateTimeField postStore={postStore} />
        <DescriptionField mode={mode} postStore={postStore} />

        {shouldShowAutoShare && (
          <div>
            <label className="inline-flex flex-row items-center cursor-pointer">
              <span className="mr-3 text-sm text-form-labels inline-block cursor-pointer">
                Automatically share to connected accounts:
              </span>
              <span className="relative inline-flex items-center inline-block">
                <input
                  type="checkbox"
                  id="shareByDefault"
                  className="sr-only peer"
                  checked={postStore.autoShare !== false}
                  onChange={setAutoShare}
                />
                {/* https://flowbite.com/docs/forms/toggle/ */}
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-form-toggle-bg peer-disabled:opacity-75"></div>
              </span>
            </label>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 mt-8 flex-wrap">
          {!appShell.inAppWebView && (
            <>
              <Button
                type="submit"
                disabled={!postStore.isPostable()}
                spinning={postStore.spinning}
                className="w-full sm:w-[150px]"
              >
                {mode === 'new' ? 'Add' : 'Save'}
              </Button>
              <Button
                intent="secondary"
                onClick={handleCancel}
                className="w-full sm:w-[150px]"
                trackEvent={trackingEvents.bcDiscardChanges}
                trackEventOpts={{ fromPage: 'postEdit' }}
              >
                {mode === 'edit' ? 'Discard changes' : 'Cancel'}
              </Button>
            </>
          )}
          {mode === 'edit' && (
            <div className="text-center sm:w-full sm:text-left">
              <Button
                intent="link"
                className="text-red-500"
                onClick={() => store.promptDeletePost(postStore.getApiPost())}
              >
                Delete update
              </Button>
            </div>
          )}
        </div>
      </form>
    </div>
  )
})

export default PostForm
