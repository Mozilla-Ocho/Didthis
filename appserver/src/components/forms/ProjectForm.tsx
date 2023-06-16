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
import pathBuilder from '@/lib/pathBuidler'
import { useRouter } from 'next/router'
import ImageUpload from '../ImageUpload'
import type { UploadCallback } from '../ImageUpload'
import { makeAutoObservable } from 'mobx'

class ProjectStore {
  title: string
  description: string
  scope: ApiScope
  projectId: ApiProjectId
  imageAssetId: string
  imageMeta: CldImageMetaAny | CldImageMetaPublic | undefined
  currentStatus: ApiProjectStatus

  constructor(
    mode: 'new' | 'edit',
    profile: ApiProfile,
    project: ApiProject | undefined
  ) {
    if (mode === 'new') {
      const profileCopy = JSON.parse(JSON.stringify(profile)) as ApiProfile
      const r = profileUtils.mkNewProject(profileCopy)
      this.title = r.project.title
      this.description = r.project.description || ''
      this.scope = r.project.scope
      this.projectId = r.project.id
      this.imageAssetId = r.project.imageAssetId || ''
      this.currentStatus = r.project.currentStatus
    } else if (project) {
      this.title = project.title
      this.description = project.description || ''
      this.scope = project.scope
      this.projectId = project.id
      this.imageAssetId = project.imageAssetId || ''
      this.imageMeta = project.imageMeta
      this.currentStatus = project.currentStatus
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
      posts: {}, // the project api ignores the posts object
    }
  }

  setTitle(x: string) {
    this.title = x
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
  setImageAssetId(
    assetId: string,
    meta: CldImageMetaAny | CldImageMetaPublic | undefined
  ) {
    this.imageAssetId = assetId
    this.imageMeta = meta
  }

}

type Props = { mode: 'new' } | { mode: 'edit'; project: ApiProject }

const ProjectForm = observer((props: Props) => {
  const { mode } = props
  const router = useRouter()
  const store = useStore()
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
  const handleSubmit = (e: React.FormEvent) => {
    e.stopPropagation()
    e.preventDefault()
    store.saveProject(projectStore.getApiProject()).then(newProject => {
      // note that saving projects ignores the posts property. for a new
      // project the backend sets that to {}, and on updates it keeps
      // whatever is currently in the user's profile for that project and
      // only updates the project's attributes.
      if (!store.user) return
      router.push(pathBuilder.project(store.user.urlSlug, newProject.id))
    })
  }
  const setTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    projectStore.setTitle(e.target.value)
  }
  const setDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    projectStore.setDescription(e.target.value)
  }
  const setVisibility = (e: React.ChangeEvent<HTMLSelectElement>) => {
    projectStore.setScope(e.target.value as ApiScope)
  }
  const setStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
    projectStore.setCurrentStatus(e.target.value as ApiProjectStatus)
  }
  const onImageUpload = useCallback(
    res => {
      projectStore.setImageAssetId(res.cloudinaryAssetId, res.info)
    },
    [projectStore]
  ) as UploadCallback
  const deleteImage = () => {
    projectStore.setImageAssetId('', undefined)
  }
  const valid = !!projectStore.title.trim()
  return (
    <div>
      <form onSubmit={handleSubmit} method="POST">
        <div>
          <label htmlFor="title">
            title:
            <Input
              type="text"
              id="title"
              name="title"
              value={projectStore.title || ''}
              onChange={setTitle}
              className="w-full"
              error={valid ? false : 'required'}
            />
          </label>
        </div>
        <div>
          <label htmlFor="description">
            description:
            <Textarea
              placeholder=""
              id="description"
              name="description"
              value={projectStore.description || ''}
              onChange={setDescription}
            />
          </label>
        </div>
        <div>
          <label htmlFor="visibility">
            visibility:
            <Select
              id="visibility"
              onChange={setVisibility}
              value={projectStore.scope}
            >
              <option key="public" value="public">
                public
              </option>
              <option key="private" value="private">
                private
              </option>
            </Select>
          </label>
        </div>
        <div>
          <label htmlFor="status">
            status:
            <Select
              id="status"
              onChange={setStatus}
              value={projectStore.currentStatus}
            >
              <option key="active" value="active">
                active
              </option>
              <option key="complete" value="complete">
                complete
              </option>
              <option key="paused" value="paused">
                paused
              </option>
            </Select>
          </label>
        </div>
        <div>
          {projectStore.imageAssetId && (
            <CloudinaryImage
              assetId={projectStore.imageAssetId}
              intent="project"
            />
          )}
          <ImageUpload
            intent="project"
            onUploadWithUseCallback={onImageUpload}
          />
          {projectStore.imageAssetId && (
            <Button onClick={deleteImage}>remove</Button>
          )}
        </div>
        <Button type="submit" disabled={!valid}>
          Save
        </Button>
      </form>
    </div>
  )
})

export default ProjectForm
