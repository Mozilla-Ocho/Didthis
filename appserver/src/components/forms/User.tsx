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
  userSlug: string
  slugWrapper: SlugCheckWrapper | undefined
  checkingSlug = true
  imageAssetId: string
  imageMeta: CldImageMetaAny | CldImageMetaPublic | undefined
  doSlugCheckDebounced: () => void

  constructor(user: ApiUser) {
    this.name = user.profile.name || ''
    this.bio = user.profile.bio || ''
    this.userSlug = user.userSlug || ''
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

  setUserSlug(slug: string) {
    this.userSlug = slug
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

  hasUserSlug() {
    return !!this.userSlug.trim()
  }

  _doSlugCheck() {
    apiClient
      .getSlugCheck({ userSlug: this.userSlug, provisionalName: this.name })
      .then(wrapper => {
        if (wrapper.payload.check.value === this.userSlug) {
          this.slugWrapper = wrapper
          this.checkingSlug = false
        }
      })
  }

  isPostable() {
    if (this.hasUserSlug()) {
      if (this.slugWrapper) {
        return (
          this.slugWrapper.payload.check.valid &&
          this.slugWrapper.payload.check.value === this.userSlug
        )
      }
      return false
    }
    // XXX other length validations
    return true
  }

  slugErrorText() {
    if (
      this.hasUserSlug() &&
      this.slugWrapper &&
      this.slugWrapper.payload.check.errorConst
    ) {
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

  suggestedSlug() {
    if (this.slugWrapper && this.slugWrapper.payload.suggested) {
      return this.slugWrapper.payload.suggested
    }
    return ''
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
      {!formStore.imageAssetId && (
        <ImageUpload intent="avatar" onUploadWithUseCallback={onResult} />
      )}
      {formStore.imageAssetId && (
        <Button intent="link" onClick={deleteImage}>
          remove
        </Button>
      )}
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
    store.saveProfile(
      formStore.getApiProfile(),
      formStore.hasUserSlug() ? formStore.userSlug.trim() : undefined
    )
  }
  const setName = (e: React.ChangeEvent<HTMLInputElement>) => {
    formStore.setName(e.target.value)
  }
  const setBio = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    formStore.setBio(e.target.value)
  }
  const setUserSlug = (e: React.ChangeEvent<HTMLInputElement>) => {
    formStore.setUserSlug(e.target.value)
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
          public username:
          <Input
            type="text"
            name="slug"
            onChange={setUserSlug}
            value={formStore.userSlug}
            customError={formStore.slugErrorText()}
            placeholder={user.userSlug || ''}
          />
          {formStore.suggestedSlug() && (
            <span>suggestion: {formStore.suggestedSlug()}</span>
          )}
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
