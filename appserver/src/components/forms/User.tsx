import { ApiClient } from '@/lib/apiClient'
import { SlugCheckWrapper } from '@/lib/apiConstants'
import branding from '@/lib/branding'
import { specialAssetIds } from '@/lib/cloudinaryConfig'
import profileUtils from '@/lib/profileUtils'
import { useStore } from '@/lib/store'
import { trackingEvents } from '@/lib/trackingEvents'
import { debounce } from 'lodash-es'
import { action, makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useCallback, useState } from 'react'
import ImageUpload, { UploadCallback } from '../ImageUpload'
import { Button, CloudinaryImage, Input, Textarea } from '../uiLib'
import { ClaimTrialAccountButton } from '../auth/ClaimTrialAccountButton'

class FormStore {
  name: string
  nameTouched = false
  bio: string
  bioTouched = false
  userSlug: string
  slugTouched = false
  slugWrapper: SlugCheckWrapper | undefined
  checkingSlug = false
  imageAssetId: string
  imageMeta: CldImageMetaPrivate | CldImageMetaPublic | undefined
  doSlugCheckDebounced: () => void
  twitter: string
  facebook: string
  reddit: string
  instagram: string
  spinning = false
  apiClient: ApiClient

  constructor(user: ApiUser, apiClient: ApiClient) {
    this.apiClient = apiClient
    this.name = user.profile.name || ''
    if (this.name) this.nameTouched = true
    this.bio = user.profile.bio || ''
    if (this.bio) this.bioTouched = true
    this.twitter = user.profile.socialUrls?.twitter || ''
    this.facebook = user.profile.socialUrls?.facebook || ''
    this.reddit = user.profile.socialUrls?.reddit || ''
    this.instagram = user.profile.socialUrls?.instagram || ''
    this.userSlug = user.userSlug || ''
    if (this.userSlug) this.slugTouched = true
    this.imageAssetId = user.profile.imageAssetId || ''
    this.imageMeta = user.profile.imageMeta
    this.doSlugCheckDebounced = debounce(this._doSlugCheck, 500, {
      leading: false,
    })
    makeAutoObservable(this, {
      doSlugCheckDebounced: false,
    })
    // for SSR reasons, we have to defer the slug check a bit. because in SSR
    // mode, the slug check is skipped.
    this.doSlugCheckDebounced()
  }

  setName(x: string) {
    this.name = x
    this.nameTouched = true
    if (this.slugWrapper && this.slugWrapper.payload.source === 'system') {
      // get updated suggested slug if they are still on a system slug and are editing their name
      this.doSlugCheckDebounced()
    }
  }
  setBio(x: string) {
    this.bio = x
    this.bioTouched = true
  }
  setImageAssetId(
    assetId: string,
    meta: CldImageMetaPrivate | CldImageMetaPublic | undefined
  ) {
    this.imageAssetId = assetId
    this.imageMeta = meta
  }
  setTwitter(x: string) {
    this.twitter = x
  }
  setFacebook(x: string) {
    this.facebook = x
  }
  setReddit(x: string) {
    this.reddit = x
  }
  setInstagram(x: string) {
    this.instagram = x
  }
  setSpinning(x: boolean) {
    this.spinning = x
  }

  setUserSlug(slug: string) {
    this.userSlug = slug
    this.slugTouched = true
    if (profileUtils.slugStringValidation(this.userSlug).valid) {
      this.checkingSlug = true
      this.doSlugCheckDebounced()
    }
  }

  getApiProfile(): ApiProfile {
    const contentOrUndef = (x: string) => (x && x.trim() ? x.trim() : undefined)
    const normUrl = (x: string) => {
      const c = contentOrUndef(x)
      const parsed = c && profileUtils.getParsedUrl(c)
      if (parsed) return parsed.toString()
    }
    return {
      name: contentOrUndef(this.name),
      bio: contentOrUndef(this.bio),
      imageAssetId: contentOrUndef(this.imageAssetId),
      imageMeta: this.imageMeta,
      projects: {}, // ignored
      updatedAt: new Date().getTime(), // ignored, server assigned
      socialUrls: {
        twitter: normUrl(this.twitter),
        facebook: normUrl(this.facebook),
        reddit: normUrl(this.reddit),
        instagram: normUrl(this.instagram),
      },
    }
  }

  hasUserSlug() {
    return !!this.userSlug.trim()
  }

  _doSlugCheck() {
    if (typeof window === 'undefined') {
      // don't run the slug check in SSR. this sort of thing is incredibly
      // non-obvious until things break...
      return
    }
    this.checkingSlug = true
    this.apiClient
      .getSlugCheck({ userSlug: this.userSlug, provisionalName: this.name })
      .then(
        action(wrapper => {
          if (wrapper.payload.check.value.trim() === this.userSlug.trim()) {
            this.slugWrapper = wrapper
            this.checkingSlug = false
          }
        })
      )
  }

  validOrEmptySocialUrl(
    network: 'twitter' | 'facebook' | 'reddit' | 'instagram'
  ) {
    const isValid = (x: string) => {
      if (!x.trim()) return true
      const parsed = profileUtils.getParsedUrl(x.trim())
      return !!parsed
    }
    if (network === 'twitter') return isValid(this.twitter)
    if (network === 'facebook') return isValid(this.facebook)
    if (network === 'reddit') return isValid(this.reddit)
    if (network === 'instagram') return isValid(this.instagram)
    return false
  }

  isPostable() {
    if (this.name.trim().length > profileUtils.maxChars.name) {
      return false
    }
    if (this.bio.trim().length > profileUtils.maxChars.blurb) {
      return false
    }
    if (this.twitter.trim().length > profileUtils.maxChars.url) {
      return false
    }
    if (this.facebook.trim().length > profileUtils.maxChars.url) {
      return false
    }
    if (this.reddit.trim().length > profileUtils.maxChars.url) {
      return false
    }
    if (this.instagram.trim().length > profileUtils.maxChars.url) {
      return false
    }
    if (!this.validOrEmptySocialUrl('twitter')) return false
    if (!this.validOrEmptySocialUrl('facebook')) return false
    if (!this.validOrEmptySocialUrl('instagram')) return false
    if (!this.validOrEmptySocialUrl('reddit')) return false
    if (this.hasUserSlug()) {
      if (!profileUtils.slugStringValidation(this.userSlug).valid) {
        return false
      }
      if (
        this.checkingSlug ||
        !this.slugWrapper ||
        this.slugWrapper.payload.check.value !== this.userSlug
      ) {
        // we haven't gotten a backend result on slug validation
        return false
      }
      if (!this.slugWrapper.payload.check.valid) {
        // backend said no
        return false
      }
    }
    // XXX other length validations
    return true
  }

  slugResultIsForUserInput() {
    return (
      this.slugWrapper &&
      this.slugWrapper.payload.check.value.trim() === this.userSlug.trim()
    )
  }

  slugGreen() {
    if (
      !this.checkingSlug &&
      this.hasUserSlug() &&
      this.slugWrapper &&
      this.slugResultIsForUserInput()
    ) {
      return (
        this.slugWrapper.payload.check.available &&
        this.slugWrapper.payload.check.valid
      )
    }
    return false
  }

  slugErrorText() {
    const localValidation = profileUtils.slugStringValidation(this.userSlug)
    if (!localValidation.valid) {
      const err = localValidation.error
      if (err === 'ERR_SLUG_TOO_SHORT') {
        // the form field component handles this
        return false
      }
      if (err === 'ERR_SLUG_TOO_LONG') {
        // the form field component handles this
        return false
      }
      if (err === 'ERR_SLUG_CHARS') {
        return 'a-z, 0-9, dashes and underscores only'
      }
      if (err === 'ERR_SLUG_UNAVAILABLE') {
        return 'Unavailable'
      }
    }
    if (
      this.hasUserSlug() &&
      this.slugWrapper &&
      this.slugResultIsForUserInput() &&
      this.slugWrapper.payload.check.errorConst
    ) {
      const err = this.slugWrapper.payload.check.errorConst
      if (err === 'ERR_SLUG_TOO_SHORT') {
        // the form field component handles this
        return false
      }
      if (err === 'ERR_SLUG_TOO_LONG') {
        // the form field component handles this
        return false
      }
      if (err === 'ERR_SLUG_CHARS') {
        return 'a-z, 0-9, dashes and underscores only'
      }
      if (err === 'ERR_SLUG_UNAVAILABLE') {
        return 'Unavailable'
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
      formStore.setImageAssetId(res.cloudinaryAssetId, res.imageMetaPrivate)
    },
    [formStore]
  ) as UploadCallback
  const deleteImage = () => {
    formStore.setImageAssetId('', undefined)
  }
  return (
    <div>
      <h5 className="mb-4">Avatar</h5>
      <div>
        <p className="w-[150px]">
          {formStore.imageAssetId ? (
            <CloudinaryImage assetId={formStore.imageAssetId} intent="avatar" />
          ) : (
            <CloudinaryImage
              assetId={specialAssetIds.defaultAvatarID}
              intent="avatar"
            />
          )}
        </p>
        <div className="flex flex-row gap-4 mt-4 w-full sm:w-auto">
          <ImageUpload
            intent="avatar"
            onUploadWithUseCallback={onResult}
            isReplace={!!formStore.imageAssetId}
            className="grow sm:grow-0"
          />
          {formStore.imageAssetId && (
            <Button
              intent="secondary"
              onClick={deleteImage}
              className="grow sm:grow-0"
              trackEvent={trackingEvents.bcRemoveImage}
              trackEventOpts={{ imgIntent: 'avatar' }}
            >
              Remove
            </Button>
          )}
        </div>
      </div>
    </div>
  )
})

const UserForm = observer(() => {
  const store = useStore()
  const user = store.user
  if (!user) {
    return <></>
  }
  const [formStore] = useState(() => new FormStore(user, store.apiClient))
  const handleSubmit = (e: React.FormEvent) => {
    e.stopPropagation()
    e.preventDefault()
    // leave it spinning through the page nav
    formStore.setSpinning(true)
    store.saveProfile(
      formStore.getApiProfile(),
      formStore.hasUserSlug() ? formStore.userSlug.trim() : undefined
    )
  }
  const handleClaimTrialAccount = async () => {
    store.trackEvent(trackingEvents.bcClaimTrialAccount)
    await store.beginClaimTrialAccount()
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
  const setTwitter = (e: React.ChangeEvent<HTMLInputElement>) => {
    formStore.setTwitter(e.target.value)
  }
  const setFacebook = (e: React.ChangeEvent<HTMLInputElement>) => {
    formStore.setFacebook(e.target.value)
  }
  const setReddit = (e: React.ChangeEvent<HTMLInputElement>) => {
    formStore.setReddit(e.target.value)
  }
  const setInstagram = (e: React.ChangeEvent<HTMLInputElement>) => {
    formStore.setInstagram(e.target.value)
  }
  return (
    <>
      <form
        onSubmit={handleSubmit}
        method="POST"
        className="flex flex-col gap-8"
      >
        {user.isTrial && (
          <div>
            <p>
              You are logged in with a trial account. You can claim this account
              by setting an email address and a password. This enables you to
              share content in public and to log into this account later.
            </p>
            <ClaimTrialAccountButton
              className="my-6 px-6 py-4 text-lg"
              onClick={handleClaimTrialAccount}
            />
          </div>
        )}
        <div>
          <h3>Account Details</h3>
          <p>
            The information you add here will be publicly visible to anyone who
            visits your page.
          </p>
        </div>
        <div>
          <label htmlFor="nameField">
            <h5>Real name</h5>
            <p className="text-form-labels text-sm">Your full display name</p>
            <Input
              id="nameField"
              type="text"
              name="name"
              onChange={setName}
              value={formStore.name}
              placeholder="Enter a name"
              className="mt-2 text-bodytext"
              touched={formStore.nameTouched}
              maxLen={profileUtils.maxChars.name}
            />
          </label>
        </div>
        <div>
          <label htmlFor="slugField">
            <h5>Username</h5>
            <p className="text-form-labels text-sm">
              Your unique handle on {branding.productName}
              {formStore.suggestedSlug() && (
                <span> (suggestion: {formStore.suggestedSlug()})</span>
              )}
            </p>
            <Input
              type="text"
              id="slugField"
              name="slug"
              onChange={setUserSlug}
              value={formStore.userSlug}
              customError={formStore.slugErrorText()}
              placeholder={user.userSlug || ''}
              className="mt-2 text-bodytext"
              touched={formStore.slugTouched}
              maxLen={profileUtils.maxChars.slug}
              minLen={profileUtils.minChars.slug}
              greenText={formStore.slugGreen() ? 'Available' : undefined}
              checkingText={
                formStore.checkingSlug ? 'Checking availability...' : ''
              }
            />
          </label>
        </div>
        <ImageField formStore={formStore} />
        <div>
          <h5>Social links</h5>
          <label
            htmlFor="sl_twitter"
            className="block mt-2 text-form-labels text-sm"
          >
            Twitter
            <Input
              type="text"
              id="sl_twitter"
              name="sl_twitter"
              onChange={setTwitter}
              value={formStore.twitter}
              className="mt-2 text-bodytext"
              touched
              maxLen={profileUtils.maxChars.url}
              hideLengthUnlessViolated
              customError={
                formStore.validOrEmptySocialUrl('twitter') ? '' : 'invalid URL'
              }
            />
          </label>
          <label
            htmlFor="sl_facebook"
            className="block mt-2 text-form-labels text-sm"
          >
            Facebook
            <Input
              type="text"
              id="sl_facebook"
              name="sl_facebook"
              onChange={setFacebook}
              value={formStore.facebook}
              className="mt-2 text-bodytext"
              touched
              maxLen={profileUtils.maxChars.url}
              hideLengthUnlessViolated
              customError={
                formStore.validOrEmptySocialUrl('facebook') ? '' : 'invalid URL'
              }
            />
          </label>
          <label
            htmlFor="sl_reddit"
            className="block mt-2 text-form-labels text-sm"
          >
            Reddit
            <Input
              type="text"
              id="sl_reddit"
              name="sl_reddit"
              onChange={setReddit}
              value={formStore.reddit}
              className="mt-2 text-bodytext"
              touched
              maxLen={profileUtils.maxChars.url}
              hideLengthUnlessViolated
              customError={
                formStore.validOrEmptySocialUrl('reddit') ? '' : 'invalid URL'
              }
            />
          </label>
          <label
            htmlFor="sl_instagram"
            className="block mt-2 text-form-labels text-sm"
          >
            Instagram
            <Input
              type="text"
              id="sl_instagram"
              name="sl_instagram"
              onChange={setInstagram}
              value={formStore.instagram}
              className="mt-2 text-bodytext"
              touched
              maxLen={profileUtils.maxChars.url}
              hideLengthUnlessViolated
              customError={
                formStore.validOrEmptySocialUrl('instagram')
                  ? ''
                  : 'invalid URL'
              }
            />
          </label>
        </div>
        <div>
          <label htmlFor="bio">
            <h5>Short bio</h5>
            <Textarea
              name="bio"
              onChange={setBio}
              value={formStore.bio}
              className="mt-2 text-bodytext"
              touched={formStore.bioTouched}
              maxLen={profileUtils.maxChars.blurb}
            />
          </label>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            spinning={formStore.spinning}
            type="submit"
            disabled={!formStore.isPostable()}
            className="w-full sm:w-[150px]"
          >
            Save
          </Button>
          <Button
            intent="secondary"
            onClick={() => store.goBack()}
            className="w-full sm:w-[150px]"
            trackEvent={trackingEvents.bcDiscardChanges}
            trackEventOpts={{ fromPage: 'userEdit' }}
          >
            Discard changes
          </Button>
        </div>
      </form>
    </>
  )
})

export default UserForm
