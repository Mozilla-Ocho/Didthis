import { ApiClient } from '@/lib/apiClient'
import { SlugCheckWrapper } from '@/lib/apiConstants'
import { specialAssetIds } from '@/lib/cloudinaryConfig'
import profileUtils from '@/lib/profileUtils'
import { useStore } from '@/lib/store'
import { trackingEvents } from '@/lib/trackingEvents'
import { ClaimTrialAccountButton } from '../auth/ClaimTrialAccountButton'
import { debounce } from 'lodash-es'
import { action, makeAutoObservable, toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useCallback, useState } from 'react'
import ImageUploadWeb, { UploadCallback } from '../ImageUpload'
import {
  Button,
  CloudinaryImage,
  Input,
  Textarea,
  ListItemLink,
  ListItemBtn,
} from '../uiLib'
import useAppShell, { useAppShellTopBar } from '@/lib/appShellContent'
import ImageUploadAppShell from '../ImageUploadAppShell'
import { LogoutButton } from '../auth/LogoutButton'
import pathBuilder from '@/lib/pathBuilder'
import DiscordAccount from '../connectedAccounts/Discord'
import { useRouter } from 'next/router'
import { Timestamp } from '../uiLib'

type customSocialPairValidity = {
  empty?: true
  badName?: true
  badUrl?: true
  good?: true
}

const NUM_CUSTOM_SOCIAL = 3

export class FormStore {
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
  customSocial: { name: string; url: string }[]
  spinning = false
  discordShareByDefault = false
  apiClient: ApiClient
  user: ApiUser

  constructor(user: ApiUser, apiClient: ApiClient) {
    this.user = user
    this.apiClient = apiClient
    this.name = user.profile.name || ''
    if (this.name) this.nameTouched = true
    this.bio = user.profile.bio || ''
    if (this.bio) this.bioTouched = true
    this.twitter = user.profile.socialUrls?.twitter || ''
    this.facebook = user.profile.socialUrls?.facebook || ''
    this.reddit = user.profile.socialUrls?.reddit || ''
    this.instagram = user.profile.socialUrls?.instagram || ''
    this.customSocial = JSON.parse(
      JSON.stringify(user.profile.socialUrls?.customSocial || [])
    )
    for (let i = 0; i < NUM_CUSTOM_SOCIAL; i++) {
      if (!this.customSocial[i]) this.customSocial[i] = { name: '', url: '' }
    }
    this.userSlug = user.userSlug || ''
    if (this.userSlug) this.slugTouched = true
    this.imageAssetId = user.profile.imageAssetId || ''
    this.imageMeta = user.profile.imageMeta
    this.discordShareByDefault =
      false !== user.profile.connectedAccounts?.discord?.shareByDefault
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
  setCustom(index: number, name: string | false, url: string | false) {
    if (name !== false) this.customSocial[index].name = name
    if (url !== false) this.customSocial[index].url = url
  }

  setSpinning(x: boolean) {
    this.spinning = x
  }
  setDiscordShareByDefault(x: boolean) {
    this.discordShareByDefault = x
  }

  setUserSlug(slug: string) {
    this.userSlug = slug
    this.slugTouched = true
    if (profileUtils.slugStringValidation(this.userSlug).valid) {
      this.checkingSlug = true
      this.doSlugCheckDebounced()
    }
  }

  getFirstUnsavedFieldName(): string | false {
    // returns the name of the first field that has unsaved changes, or false if none. used to show a warning when navigating away on discord pairing if unsaved changes exist.
    if ((this.name || '').trim() !== (this.user.profile.name || '').trim())
      return 'name'
    if ((this.bio || '').trim() !== (this.user.profile.bio || '').trim())
      return 'bio'
    if ((this.userSlug || '').trim() !== (this.user.userSlug || '').trim())
      return 'userSlug'
    if (
      (this.imageAssetId || '').trim() !==
      (this.user.profile.imageAssetId || '').trim()
    )
      return 'imageAssetId'
    if (
      (this.twitter || '').trim() !==
      (this.user.profile.socialUrls?.twitter || '').trim()
    )
      return 'twitter'
    if (
      (this.facebook || '').trim() !==
      (this.user.profile.socialUrls?.facebook || '').trim()
    )
      return 'facebook'
    if (
      (this.reddit || '').trim() !==
      (this.user.profile.socialUrls?.reddit || '').trim()
    )
      return 'reddit'
    if (
      (this.instagram || '').trim() !==
      (this.user.profile.socialUrls?.instagram || '').trim()
    )
      return 'instagram'
    if (
      this.customSocial.some(
        (pair, i) =>
          // note that customSocial has NUM_CUSTOM_SOCIAL entries always, but profile.socialUrls might have 0-NUM_CUSTOM_SOCIAL
          pair.name !==
            (this.user.profile.socialUrls?.customSocial?.[i]?.name || '') ||
          pair.url !==
            (this.user.profile.socialUrls?.customSocial?.[i]?.url || '')
      )
    )
      return 'customSocial'
    if (this.user.profile.connectedAccounts?.discord) {
      if (
        !!this.discordShareByDefault !==
        !!this.user.profile.connectedAccounts?.discord?.shareByDefault
      )
        return 'discordShareByDefault'
    }
    return false
  }

  getApiProfile(): ApiProfile {
    const contentOrUndef = (x: string) => (x && x.trim() ? x.trim() : undefined)
    const normUrl = (x: string) => {
      const c = contentOrUndef(x)
      const parsed = c && profileUtils.getParsedUrl(c)
      if (parsed) return parsed.toString()
      return undefined
    }
    let customSocial: ApiCustomSocialList = []
    for (let i = 0; i < NUM_CUSTOM_SOCIAL; i++) {
      if (this.customSocialPairState(i).good) {
        customSocial.push({
          name: this.customSocial[i].name,
          url: profileUtils.getParsedUrl(this.customSocial[i].url).toString(),
        })
      }
    }

    let { connectedAccounts } = this.user.profile
    if (connectedAccounts?.discord) {
      connectedAccounts = {
        ...connectedAccounts,
        discord: {
          ...connectedAccounts.discord,
          shareByDefault: this.discordShareByDefault,
        },
      }
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
        customSocial: customSocial.length ? customSocial : undefined,
      },
      connectedAccounts,
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

  customSocialPairState(index: number): customSocialPairValidity {
    const name = this.customSocial[index].name
    const url = this.customSocial[index].url
    if (!name.trim() && !url.trim()) return { empty: true }
    const ret: customSocialPairValidity = {}
    if (!name.trim() || name.length > profileUtils.maxChars.customSocialName)
      ret.badName = true
    if (!url.trim() || !profileUtils.getParsedUrl(url.trim())) ret.badUrl = true
    if (url.trim().length > profileUtils.maxChars.url) ret.badUrl = true
    return Object.keys(ret).length ? ret : { good: true }
  }

  validOrEmptySocialUrl(
    network: 'twitter' | 'facebook' | 'reddit' | 'instagram' | 'custom',
    index?: number
  ) {
    const isValidUrl = (x: string) => {
      if (x.trim().length > profileUtils.maxChars.url) return false
      const parsed = profileUtils.getParsedUrl(x.trim())
      return !!parsed
    }
    const isValidOrEmptyUrl = (x: string) => {
      if (!x.trim()) return true
      return isValidUrl(x)
    }
    if (network === 'twitter') return isValidOrEmptyUrl(this.twitter)
    if (network === 'facebook') return isValidOrEmptyUrl(this.facebook)
    if (network === 'reddit') return isValidOrEmptyUrl(this.reddit)
    if (network === 'instagram') return isValidOrEmptyUrl(this.instagram)
    if (network === 'custom' && index !== undefined) {
      if (this.customSocialPairState(index).empty) return true
      if (this.customSocialPairState(index).good) return true
    }
    return false
  }

  validCustomName(name: string) {
    if (!name.trim()) return false
    return name.length <= profileUtils.maxChars.customSocialName
  }

  isPostable() {
    if (this.name.trim().length > profileUtils.maxChars.name) {
      return false
    }
    if (this.bio.trim().length > profileUtils.maxChars.blurb) {
      return false
    }
    if (!this.validOrEmptySocialUrl('twitter')) return false
    if (!this.validOrEmptySocialUrl('facebook')) return false
    if (!this.validOrEmptySocialUrl('instagram')) return false
    if (!this.validOrEmptySocialUrl('reddit')) return false
    if (!this.validOrEmptySocialUrl('custom', 0)) return false
    if (!this.validOrEmptySocialUrl('custom', 1)) return false
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
  const appShell = useAppShell()
  const onResult = useCallback(
    res => {
      formStore.setImageAssetId(res.cloudinaryAssetId, res.imageMetaPrivate)
    },
    [formStore]
  ) as UploadCallback
  const deleteImage = () => {
    formStore.setImageAssetId('', undefined)
  }
  const ImageUpload = appShell.appReady ? ImageUploadAppShell : ImageUploadWeb
  return (
    <div>
      <h5 className="text-sm mb-4">Profile picture</h5>
      <div className="flex items-center">
        <p className="w-[200px]">
          {formStore.imageAssetId ? (
            <CloudinaryImage assetId={formStore.imageAssetId} intent="avatar" />
          ) : (
            <CloudinaryImage
              assetId={specialAssetIds.defaultAvatarID}
              intent="avatar"
            />
          )}
        </p>
        <div className="flex flex-col gap-4 ml-4 w-full sm:w-auto">
          <ImageUpload
            intent="avatar"
            onUploadWithUseCallback={onResult}
            isReplace={!!formStore.imageAssetId}
            className="grow sm:grow-0 btn-height"
          />
          {formStore.imageAssetId && (
            <Button
              intent="secondary"
              onClick={deleteImage}
              className="grow sm:grow-0 btn-height"
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
  const router = useRouter()
  const appShell = useAppShell()
  const user = store.user
  if (!user) {
    return <></>
  }
  const { exportStatus } = user.profile

  const [formStore] = useState(() => new FormStore(user, store.apiClient))
  const performSubmit = () => {
    // leave it spinning through the page nav
    formStore.setSpinning(true)
    store.saveProfile(
      formStore.getApiProfile(),
      formStore.hasUserSlug() ? formStore.userSlug.trim() : undefined
    )
  }
  const handleSubmit = (e: React.FormEvent) => {
    e.stopPropagation()
    e.preventDefault()
    performSubmit()
  }
  const handleCancel = () => {
    // Navigate directly to user home, because store.goBack() may take us
    // back to a connected account page (e.g. Discord OAuth)
    router.push(pathBuilder.user(user.systemSlug))
  }

  const handleDeleteAccount = () => store.promptDeleteAccount()

  const handleExportAccount = () => store.exportAccount()

  const handleShowAppInfo = () => appShell.api.request('showAppInfo')

  useAppShellTopBar({
    show: true,
    title: 'Account details',
    leftIsBack: true,
    leftLabel: 'Back',
    rightLabel: 'Save',
    rightIsDisabled: !formStore.isPostable(),
    onLeftPress: handleCancel,
    onRightPress: performSubmit,
  })

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
  const setCustom = (
    index: number,
    field: 'url' | 'name',
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    formStore.setCustom(
      index,
      field === 'name' ? e.target.value : false,
      field === 'url' ? e.target.value : false
    )
  }
  return (
    <>
      {!appShell.inAppWebView && (
        <>
          <div className="mb-10">
            <h3 className="text-lg">Account Details</h3>
            <p>
              The information you add here will be publicly visible to anyone
              who visits your page.
            </p>
            {user.isTrial && (
              <p className="my-4 p-4 text-sm bg-yellow-100">
                Heads up: account details are not editable or publicly visible
                until you{' '}
                <ClaimTrialAccountButton intent="link" text="sign up" />.
              </p>
            )}
          </div>
        </>
      )}
      <form
        onSubmit={handleSubmit}
        method="POST"
        className={'flex flex-col gap-8 ' + (user.isTrial ? 'opacity-60' : '')}
      >
        {/* Avatar */}
        {!user.isTrial && <ImageField formStore={formStore} />}

        {/* Display Name */}
        <div>
          <label htmlFor="nameField">
            <h5 className="text-sm">Display name</h5>
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
              disabled={user.isTrial}
            />
          </label>
        </div>
        {/* URL Path */}
        <div>
          <label htmlFor="slugField">
            <h5 className="text-sm">Your custom URL path</h5>
            <p className="text-form-labels text-sm">
              A custom URL path helps people find your Didthis page, this is a
              link that you can share with your friends so they can find you.
            </p>
            <p className="text-form-labels text-sm my-2">
              {`https://didthis.app/user/${formStore.userSlug}`}
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
              disabled={user.isTrial}
            />
          </label>
        </div>

        {/* Short Bio */}
        <div>
          <label htmlFor="bio">
            <h5 className="text-sm">Short bio</h5>
            <Textarea
              name="bio"
              onChange={setBio}
              value={formStore.bio}
              className="mt-2 text-bodytext"
              touched={formStore.bioTouched}
              maxLen={profileUtils.maxChars.blurb}
              disabled={user.isTrial}
              style={{ minHeight: 123 }}
            />
          </label>
        </div>

        {/* Connected Accounts */}
        <div>
          <h5 className="text-sm" id="connect-discord-account">
            Discord
          </h5>
          <DiscordAccount
            user={user}
            shareByDefault={formStore.discordShareByDefault}
            setShareByDefault={v => formStore.setDiscordShareByDefault(v)}
            hasUnsavedFormChanges={!!formStore.getFirstUnsavedFieldName()}
          />
        </div>

        {/* Social Links */}
        <div>
          <h5 className="text-sm">Social links</h5>
          <p className="text-form-labels text-sm">
            Visible to others when viewing your profile
          </p>
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
              disabled={user.isTrial}
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
              disabled={user.isTrial}
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
              disabled={user.isTrial}
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
              disabled={user.isTrial}
            />
          </label>
          {/* Custom Social Links */}
          <label className="block mt-2 -mb-2 text-form-labels text-sm grid grid-cols-[40%,1fr] gap-2">
            <div>Custom:</div>
            <div />
            <div>Name (e.g. Mastodon)</div>
            <div>URL</div>
          </label>

          {formStore.customSocial.map((pair, i) => (
            <label
              key={i}
              htmlFor={'sl_custom' + i}
              className="block mt-2 text-form-labels text-sm grid grid-cols-[40%,1fr] gap-2"
            >
              <Input
                type="text"
                id={'sl_custom_name' + i}
                name={'sl_custom_name' + i}
                placeholder="Site name"
                onChange={x => setCustom(i, 'name', x)}
                value={pair.name}
                className="mt-2 text-bodytext"
                touched
                maxLen={profileUtils.maxChars.customSocialName}
                hideLengthUnlessViolated
                customError={
                  formStore.customSocialPairState(i).badName
                    ? 'invalid name'
                    : ''
                }
                disabled={user.isTrial}
              />
              <Input
                type="text"
                id={'sl_custom_url' + i}
                name={'sl_custom_url' + i}
                onChange={x => setCustom(i, 'url', x)}
                placeholder="https://..."
                value={pair.url}
                className="mt-2 text-bodytext"
                touched
                maxLen={profileUtils.maxChars.url}
                hideLengthUnlessViolated
                customError={
                  formStore.customSocialPairState(i).badUrl ? 'invalid URL' : ''
                }
                disabled={user.isTrial}
              />
            </label>
          ))}
        </div>

        {!appShell.inAppWebView && (
          <>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                spinning={formStore.spinning}
                type="submit"
                disabled={!formStore.isPostable() || user.isTrial}
                className="w-full sm:w-[150px]"
              >
                Save
              </Button>
              <Button
                intent="secondary"
                onClick={handleCancel}
                className="w-full sm:w-[150px]"
                trackEvent={trackingEvents.bcDiscardChanges}
                trackEventOpts={{ fromPage: 'userEdit' }}
              >
                Discard changes
              </Button>
            </div>
          </>
        )}
      </form>

      {/* Legal links for native app. in web, they are in the footer */}
      {appShell.inAppWebView && (
        <div className="my-10">
          <ListItemLink
            LegalDoc
            href={pathBuilder.legal('pp')}
            textlabel="Privacy Notice"
          />
          <ListItemLink
            LegalDoc
            href={pathBuilder.legal('tos')}
            textlabel="Terms of service"
          />
          <ListItemLink
            LegalDoc
            href={pathBuilder.legal('cp')}
            textlabel="Content Policies"
          />
          <ListItemBtn textlabel="App Info" onClick={handleShowAppInfo} />
        </div>
      )}

      <div className="my-10">
        <h5 className="text-sm">Account data export:</h5>
        <p className="text-form-labels text-sm">
          If you would like to export the content and data from your account,
          you can do so here. This will begin a system background job to create
          a zip file containing all your public and private content, which will
          be made available here for download when it is ready.
        </p>
        <p className="text-form-labels text-sm mt-3">
          Note: this process may take some time to complete. Refresh this page
          periodically to check status.
        </p>
        <div className="flex flex-row gap-4 justify-items-center items-center">
          <Button
            intent="secondary"
            onClick={handleExportAccount}
            className="text-sm mt-4"
            trackEvent={trackingEvents.bcExportAccount}
          >
            Export account
          </Button>
          {exportStatus && (
            <span className="text-sm mt-3 ml-1 text-form-labels">
              {exportStatus.state === 'pending' && (
                <>
                  Export requested
                  {exportStatus.requestedAt && (
                    <>
                      : <Timestamp millis={exportStatus.requestedAt} />
                    </>
                  )}
                </>
              )}
              {exportStatus.state === 'started' && (
                <>
                  Export started
                  {exportStatus.startedAt && (
                    <>
                      : <Timestamp millis={exportStatus.startedAt} />
                    </>
                  )}
                </>
              )}
              {exportStatus.state === 'error' && (
                <>
                  Export failed
                  {exportStatus.finishedAt && (
                    <>
                      : <Timestamp millis={exportStatus.finishedAt} />
                    </>
                  )}
                  <br />
                  Please try again later.
                </>
              )}
              {exportStatus.state === 'complete' && (
                <>
                  Export completed
                  {exportStatus.finishedAt && (
                    <>
                      : <Timestamp millis={exportStatus.finishedAt} />
                    </>
                  )}
                  <br />
                  <a
                    href={exportStatus.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-500 underline font-extrabold"
                  >
                    Click here to download
                  </a>
                </>
              )}
            </span>
          )}
        </div>
      </div>

      <div className="my-10">
        <h5 className="text-sm">Account deletion:</h5>
        <p className="text-form-labels text-sm">
          If you would like to delete your account, you can do so here. This
          will permanently destroy all your public and private content, log you
          out on all devices, and cannot be undone &mdash; not even by customer
          support.{' '}
        </p>
        <Button
          intent="secondary"
          onClick={handleDeleteAccount}
          className="text-sm border-red-500 text-red-500 mt-4"
          trackEvent={trackingEvents.bcDeleteAccount}
        >
          Delete account
        </Button>
      </div>

      <hr className="my-6" />
      <LogoutButton intent="secondary" />
    </>
  )
})

export default UserForm
