import apiClient from '@/lib/apiClient'
import { SlugCheckWrapper } from '@/lib/apiConstants'
import { useStore } from '@/lib/store'
import { debounce } from 'lodash-es'
import { makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useCallback, useState } from 'react'
import ImageUpload, { UploadCallback } from '../ImageUpload'
import { Button, CloudinaryImage, Input, Textarea } from '../uiLib'

class FormStore {
  name: string
  bio: string
  inputSlug: string
  slugWrapper: SlugCheckWrapper | undefined
  checkingSlug = false
  imageAssetId: string
  imageMeta: CldImageMetaAny | CldImageMetaPublic | undefined
  doSlugCheckDebounced: () => void

  constructor(user: ApiUser) {
    this.name = user.profile.name || ''
    this.bio = user.profile.bio || ''
    this.inputSlug = user.urlSlug
    this.imageAssetId = user.profile.imageAssetId || ''
    this.imageMeta = user.profile.imageMeta
    this.doSlugCheckDebounced = debounce(this._doSlugCheck, 1000, {
      leading: false,
    })
    makeAutoObservable(this, {
      doSlugCheckDebounced: false,
    })
    this._doSlugCheck()
  }

  setName(x: string) {
    this.name = x
  }
  setBio(x: string) {
    this.bio = x
  }
  setImageAssetId(
    assetId: string,
    meta: CldImageMetaAny | CldImageMetaPublic | undefined
  ) {
    this.imageAssetId = assetId
    this.imageMeta = meta
  }

  setInputSlug(slug: string) {
    this.inputSlug = slug
  }

  getApiProfile(): ApiProfile {
    return {
      name: this.name.trim() || undefined,
      bio: this.bio.trim() || undefined,
      imageAssetId: this.imageAssetId || undefined,
      imageMeta: this.imageMeta,
      projects: {}, // ignored
    }
  }

  _doSlugCheck() {
    this.checkingSlug = true
    apiClient.getSlugCheck({ slug: this.inputSlug }).then(wrapper => {
      this.slugWrapper = wrapper
      this.checkingSlug = false
    })
  }

  get isPostable() {
    // XXX length validations
    return this.slugWrapper ? this.slugWrapper.payload.check.valid : false
  }
}

const ImageField = observer(({ formStore }: { formStore: FormStore }) => {
  const onResult = useCallback(
    res => {
      formStore.setImageAssetId(res.cloudinaryAssetId, res.info)
    },
    [formStore]
  ) as UploadCallback
  const deleteImage = () => {
    formStore.setImageAssetId('', undefined)
  }
  return (
    <div>
      {formStore.imageAssetId && (
        <CloudinaryImage assetId={formStore.imageAssetId} intent="avatar" />
      )}
      <ImageUpload intent="post" onUploadWithUseCallback={onResult} />
      {formStore.imageAssetId && <Button onClick={deleteImage}>remove</Button>}
    </div>
  )
})

const UserForm = observer(() => {
  const store = useStore()
  const user = store.user
  if (!user) {
    return <></>
  }
  const [formStore] = useState(() => new FormStore(user))
  const handleSubmit = (e: React.FormEvent) => {
    e.stopPropagation()
    e.preventDefault()
    store.saveProfile(formStore.getApiProfile())
  }
  const setName = (e: React.ChangeEvent<HTMLInputElement>) => {
    formStore.setName(e.target.value)
  }
  const setBio = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    formStore.setBio(e.target.value)
  }
  const setInputSlug = (e: React.ChangeEvent<HTMLInputElement>) => {
    formStore.setInputSlug(e.target.value)
  }
  return (
    <>
      <form onSubmit={handleSubmit} method="POST">
        <label>
          name:
          <Input
            type="text"
            name="name"
            onChange={setName}
            value={formStore.name}
          />
        </label>
        <label>
          slug:
          <Input
            type="text"
            name="slug"
            onChange={setInputSlug}
            value={formStore.inputSlug}
          />
          {formStore.checkingSlug && 'checking...'}
          {JSON.stringify(formStore.slugWrapper)}
        </label>
        <label>
          bio:
          <Textarea name="bio" onChange={setBio} value={formStore.bio} />
        </label>
        <ImageField formStore={formStore} />
      </form>
    </>
  )
})

export default UserForm
