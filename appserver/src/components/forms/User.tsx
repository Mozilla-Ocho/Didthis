import apiClient from '@/lib/apiClient'
import { SlugCheckWrapper } from '@/lib/apiConstants'
import { useStore } from '@/lib/store'
import { debounce } from 'lodash-es'
import { computed, makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useCallback, useState } from 'react'
import ImageUpload, { UploadCallback } from '../ImageUpload'
import { Button, CloudinaryImage, Input, Textarea } from '../uiLib'

class FormStore {
  name: string
  bio: string
  inputSlug: string
  slugWrapper: SlugCheckWrapper | undefined
  checkingSlug = true
  imageAssetId: string
  imageMeta: CldImageMetaAny | CldImageMetaPublic | undefined
  doSlugCheckDebounced: () => void

  constructor(user: ApiUser) {
    this.name = user.profile.name || ''
    this.bio = user.profile.bio || ''
    this.inputSlug = user.urlSlug
    this.imageAssetId = user.profile.imageAssetId || ''
    this.imageMeta = user.profile.imageMeta
    this.doSlugCheckDebounced = debounce(this._doSlugCheck, 500, {
      leading: false,
    })
    makeAutoObservable(this, {
      doSlugCheckDebounced: false,
    })
    this._doSlugCheck()
  }

  setName(x: string) {
    this.name = x
    if (this.slugWrapper && this.slugWrapper.payload.source === 'system') {
      // get updated suggested slug if they are still on a system slug and are editing their name
      this.checkingSlug = true
      this.doSlugCheckDebounced()
    }
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
    this.checkingSlug = true
    this.doSlugCheckDebounced()
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
    apiClient
      .getSlugCheck({ slug: this.inputSlug, provisionalName: this.name })
      .then(wrapper => {
        if (wrapper.payload.check.value === this.inputSlug) {
          this.slugWrapper = wrapper
          this.checkingSlug = false
        }
      })
  }

  isPostable() {
    // XXX length validations
    return this.slugWrapper
      ? this.slugWrapper.payload.check.valid &&
          this.slugWrapper.payload.check.value === this.inputSlug
      : false
  }

  slugErrorText() {
    if (this.slugWrapper && this.slugWrapper.payload.check.errorConst) {
      const err = this.slugWrapper.payload.check.errorConst
      if (err === 'ERR_SLUG_TOO_SHORT') {
        return 'too short'
      }
      if (err === 'ERR_SLUG_TOO_LONG') {
        return 'too long'
      }
      if (err === 'ERR_SLUG_CHARS') {
        return 'a-z, 0-9, dashes and underscores only'
      }
      if (err === 'ERR_SLUG_UNAVAILABLE') {
        return 'unavailable'
      }
    }
    return false
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
      <ImageUpload intent="avatar" onUploadWithUseCallback={onResult} />
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
            error={formStore.slugErrorText()}
          />
          {formStore.slugErrorText()}
          {formStore.checkingSlug && 'checking...'}
          {JSON.stringify(formStore.slugWrapper)}
        </label>
        <label>
          bio:
          <Textarea name="bio" onChange={setBio} value={formStore.bio} />
        </label>
        <ImageField formStore={formStore} />
        <Button type="submit" disabled={!formStore.isPostable()}>
          Save
        </Button>
      </form>
    </>
  )
})

export default UserForm
