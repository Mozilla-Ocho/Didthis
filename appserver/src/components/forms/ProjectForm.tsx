import { observer } from 'mobx-react-lite'
import { useStore } from '@/lib/store'
import {
  Select,
  Input,
  Textarea,
  Button,
  CloudinaryImage,
} from '@/components/uiLib'
import { useState, useCallback } from 'react'
import profileUtils from '@/lib/profileUtils'
import pathBuilder from '@/lib/pathBuilder'
import { useRouter } from 'next/router'
import ImageUploadWeb from '../ImageUpload'
import type { UploadCallback } from '../ImageUpload'
import { makeAutoObservable } from 'mobx'
import { trackingEvents } from '@/lib/trackingEvents'
import { ClaimTrialAccountButton } from '../auth/ClaimTrialAccountButton'
import useAppShell, { useAppShellTopBar } from '@/lib/appShellContent'
import ImageUploadAppShell from '../ImageUploadAppShell'

class ProjectStore {
  title: string
  titleTouched = false
  description: string
  scope: ApiScope
  projectId: ApiProjectId
  imageAssetId: string
  imageMeta: CldImageMetaPrivate | CldImageMetaPublic | undefined
  currentStatus: ApiProjectStatus
  shareByDefault: boolean
  spinning = false

  constructor(
    mode: 'new' | 'edit',
    profile: ApiProfile,
    project: ApiProject | undefined
  ) {
    if (mode === 'new') {
      const profileCopy = JSON.parse(JSON.stringify(profile)) as ApiProfile
      const r = profileUtils.mkNewProject(profileCopy)
      this.title = '' // not using r.project.title, we want user to specify
      this.description = r.project.description || ''
      this.scope = r.project.scope
      this.projectId = r.project.id
      this.imageAssetId = r.project.imageAssetId || ''
      this.currentStatus = r.project.currentStatus

      const defaultShareByDefault = profile.connectedAccounts?.discord?.shareByDefault;
      this.shareByDefault = false !== defaultShareByDefault
    } else if (project) {
      this.title = project.title
      this.titleTouched = true
      this.description = project.description || ''
      this.scope = project.scope
      this.projectId = project.id
      this.imageAssetId = project.imageAssetId || ''
      this.imageMeta = project.imageMeta
      this.currentStatus = project.currentStatus
      this.shareByDefault = false !== project.shareByDefault
    } else {
      throw new Error('project is required in constructor if mode != new')
    }
    makeAutoObservable(this, {})
  }

  getApiProject(): ApiProject {
    return {
      id: this.projectId, // respected at backend
      createdAt: 0, // ignored / assigned at backend
      updatedAt: 0, // "
      title: this.title,
      scope: this.scope,
      currentStatus: this.currentStatus,
      description: this.description.trim(),
      imageAssetId: this.imageAssetId || undefined,
      imageMeta: this.imageMeta,
      shareByDefault: this.shareByDefault,
      posts: {}, // the project api ignores the posts object
    }
  }

  setTitle(x: string) {
    this.title = x
    this.titleTouched = true
  }
  setDescription(x: string) {
    this.description = x
  }
  setCurrentStatus(x: ApiProjectStatus) {
    this.currentStatus = x
  }
  setScope(x: ApiScope) {
    this.scope = x
  }
  setShareByDefault(x: boolean) {
    this.shareByDefault = x
  }
  setImageAssetId(
    assetId: string,
    meta: CldImageMetaPrivate | CldImageMetaPublic | undefined
  ) {
    this.imageAssetId = assetId
    this.imageMeta = meta
  }
  setSpinning(x: boolean) {
    this.spinning = x
  }

  isPostable() {
    if (!this.title.trim()) return false
    if (this.title.trim().length > profileUtils.maxChars.title) return false
    if (this.description.trim().length > profileUtils.maxChars.blurb)
      return false
    return true
  }
}

type Props = { mode: 'new' } | { mode: 'edit'; project: ApiProject }

const ProjectForm = observer((props: Props) => {
  const { mode } = props
  const router = useRouter()
  const store = useStore()
  const appShell = useAppShell()
  const user = store.user
  if (!user) return <></>
  const [projectStore] = useState(
    () =>
      new ProjectStore(
        mode,
        user.profile,
        mode === 'edit' ? props.project : undefined
      )
  )
  const performSubmit = () => {
    projectStore.setSpinning(true)
    store
      .saveProject(
        projectStore.getApiProject(),
        mode,
        mode === 'edit' ? props.project : undefined
      )
      .then(newProject => {
        // note that saving projects ignores the posts property. for a new
        // project the backend sets that to {}, and on updates it keeps
        // whatever is currently in the user's profile for that project and
        // only updates the project's attributes.
        if (!store.user) return
        router.push(pathBuilder.project(store.user.systemSlug, newProject.id))
      })
  }
  const handleSubmit = (e: React.FormEvent) => {
    e.stopPropagation()
    e.preventDefault()
    performSubmit()
  }
  const setTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    projectStore.setTitle(e.target.value)
  }
  const setDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    projectStore.setDescription(e.target.value)
  }
  const setVisibility = (e: React.ChangeEvent<HTMLInputElement>) => {
    projectStore.setScope(e.target.checked ? 'public' : 'private')
  }
  const setShareByDefault = (e: React.ChangeEvent<HTMLInputElement>) => {
    projectStore.setShareByDefault(e.target.checked)
  }
  const setStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
    projectStore.setCurrentStatus(e.target.value as ApiProjectStatus)
  }
  const onImageUpload = useCallback(
    res => {
      projectStore.setImageAssetId(res.cloudinaryAssetId, res.imageMetaPrivate)
    },
    [projectStore]
  ) as UploadCallback
  const deleteImage = () => {
    projectStore.setImageAssetId('', undefined)
  }
  const handleCancel = () => {
    store.goBack()
  }

  const ImageUpload = appShell.appReady ? ImageUploadAppShell : ImageUploadWeb

  useAppShellTopBar({
    show: true,
    title: `${mode === 'new' ? 'Create' : 'Edit'} project`,
    leftIsBack: true,
    leftLabel: 'Back',
    rightLabel: mode === 'new' ? 'Create' : 'Save',
    rightIsDisabled: !projectStore.isPostable(),
    onLeftPress: handleCancel,
    onRightPress: performSubmit,
  })

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        method="POST"
        className="flex flex-col gap-8"
      >
        <div>
          <label htmlFor="title" className="text-form-labels text-sm">
            Project title:
            <Input
              type="text"
              id="title"
              name="title"
              value={projectStore.title || ''}
              onChange={setTitle}
              className="mt-2 text-bodytext"
              required
              touched={projectStore.titleTouched}
              maxLen={profileUtils.maxChars.title}
            />
          </label>
        </div>
        <div>
          <label htmlFor="description" className="text-form-labels text-sm">
            Project description:
            <Textarea
              placeholder=""
              id="description"
              name="description"
              value={projectStore.description || ''}
              onChange={setDescription}
              className="mt-2 text-bodytext"
              touched={true}
              maxLen={profileUtils.maxChars.blurb}
            />
          </label>
        </div>
        <div>
          <label htmlFor="status" className="text-form-labels text-sm">
            Status:
            <Select
              id="status"
              onChange={setStatus}
              value={projectStore.currentStatus}
              className="mt-2 text-bodytext"
            >
              <option key="active" value="active">
                Active
              </option>
              <option key="complete" value="complete">
                Complete
              </option>
              <option key="paused" value="paused">
                Paused
              </option>
            </Select>
          </label>
        </div>
        <div>
          <div className="text-form-labels text-sm mb-2">
            Project cover image:
          </div>
          {projectStore.imageAssetId && (
            <CloudinaryImage
              assetId={projectStore.imageAssetId}
              intent="project"
              lightbox
            />
          )}
          <div className="flex flex-row gap-4 mt-4 w-full sm:w-auto">
            <ImageUpload
              intent="project"
              onUploadWithUseCallback={onImageUpload}
              isReplace={!!projectStore.imageAssetId}
              className="grow sm:grow-0"
            />
            {projectStore.imageAssetId && (
              <Button
                intent="secondary"
                onClick={deleteImage}
                className="grow sm:grow-0 leading-tight"
                trackEvent={trackingEvents.bcRemoveImage}
                trackEventOpts={{ imgIntent: 'project' }}
              >
                Remove image
              </Button>
            )}
          </div>
        </div>
        <div>
          <label
            htmlFor="visibility"
            className="inline-flex flex-row items-center cursor-pointer"
          >
            <span className="mr-3 text-sm text-form-labels inline-block cursor-pointer">
              Public project:
            </span>
            <span className="relative inline-flex items-center inline-block">
              <input
                type="checkbox"
                id="visibility"
                value="private"
                className="sr-only peer"
                disabled={user.isTrial}
                checked={projectStore.scope !== 'private'}
                onChange={setVisibility}
              />
              {/* https://flowbite.com/docs/forms/toggle/ */}
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-form-toggle-bg peer-disabled:opacity-75"></div>
            </span>
          </label>
          <p className="text-sm my-4">
            You can share your project out to others when you make your project
            public.
          </p>
          {user.isTrial && (
            <p className="my-4 p-4 text-sm bg-yellow-100">
              Heads up: To make a project public (and to manage it from other
              devices), you’ll need to{' '}
              <ClaimTrialAccountButton intent="link" text="sign up" /> first.
            </p>
          )}
        </div>
        {projectStore.scope !== 'private' && (
          <div>
            <label className="inline-flex flex-row items-center cursor-pointer">
              <span className="mr-3 text-sm text-form-labels inline-block cursor-pointer">
                Automatically share updates by default:
              </span>
              <span className="relative inline-flex items-center inline-block">
                <input
                  type="checkbox"
                  id="shareByDefault"
                  value="private"
                  className="sr-only peer"
                  disabled={user.isTrial}
                  checked={projectStore.shareByDefault}
                  onChange={setShareByDefault}
                />
                {/* https://flowbite.com/docs/forms/toggle/ */}
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-form-toggle-bg peer-disabled:opacity-75"></div>
              </span>
            </label>
            <p className="text-sm my-4">
              You can decide on a per-update basis to automatically share
              updates to connected accounts, with this setting as the default
              choice.
            </p>
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
          {!appShell.inAppWebView && (
            <>
              <Button
                spinning={projectStore.spinning}
                type="submit"
                disabled={!projectStore.isPostable()}
                className="w-full sm:w-[150px]"
              >
                {mode === 'new' ? 'Create' : 'Save'}
              </Button>
              <Button
                intent="secondary"
                onClick={handleCancel}
                className="w-full sm:w-[150px]"
                trackEvent={trackingEvents.bcDiscardChanges}
                trackEventOpts={{ fromPage: 'projectEdit' }}
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
                onClick={() =>
                  store.promptDeleteProject(projectStore.getApiProject())
                }
              >
                Delete project
              </Button>
            </div>
          )}
        </div>
      </form>
    </div>
  )
})

export default ProjectForm
