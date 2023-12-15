import { observer } from 'mobx-react-lite'
import { useStore } from '@/lib/store'
import Image from 'next/image'
import ProjectList from '@/components/ProjectList'
import { Button, Divider, Link, PagePad } from '@/components/uiLib'
import pathBuilder from '@/lib/pathBuilder'
import UserPreview, { UserAvatar, UserSocialLinks } from '../UserPreview'
import { useLocalStorage } from 'usehooks-ts'
import { useEffect, useState } from 'react'
import { trackingEvents } from '@/lib/trackingEvents'
import PageTitle from '../PageTitle'
import OgMeta from '../OgMeta'
import RemindersAndAlerts from '../RemindersAndAlerts'
import branding from '@/lib/branding'
import useAppShell from '@/lib/appShellContent'

import settingsGear from '@/assets/img/settings-gear.svg'

const HomeAuth = observer(() => {
  const store = useStore()
  const [skipBlankSlate, setSkipBlankSlate] = useLocalStorage(
    'skipBlankSlate', // DRY_26502
    false
  )
  const [rendered, setRendered] = useState(false)
  store.useTrackedPageEvent(trackingEvents.pvHomeAuth)

  const appShell = useAppShell()
  useEffect(() => {
    // Update the app shell with user & nav related details
    if (store.user && appShell.appReady) {
      appShell.api.request('updateAppConfig', {
        user: store.user,
        links: {
          user: pathBuilder.user(store.user.systemSlug),
          userEdit: pathBuilder.userEdit(store.user.systemSlug),
          newPost: pathBuilder.newPost(store.user.systemSlug),
        },
      })
    }
  }, [store.user, appShell.appReady, appShell.api])

  useEffect(() => {
    // this is a hack to prevent a failure of client vs server rendering state,
    // by just rendering blank initially, and then using useState (which is
    // client-only) to activate rendering.  this is because we're using
    // localStorage-based state to decide if we should show the full page, or
    // the blank slate, which the server rendering doesn't have access to.
    if (!rendered) setRendered(true)
  }, [rendered])
  if (!rendered) return <></>
  if (!store.user) return <></> // typescript helper, it doesn't know this component is auth only
  const hasProjects = Object.keys(store.user.profile.projects).length > 0
  const hasProfileEdits =
    store.user.profile.name ||
    store.user.userSlug ||
    store.user.profile.imageAssetId
  const inBlankSlate = !hasProjects && !hasProfileEdits && !skipBlankSlate
  const handleSkip = () => {
    setSkipBlankSlate(true)
  }

  const ugcUsername = store.user.userSlug || store.user.profile.name
  const title = ugcUsername ? ugcUsername + '’s projects' : 'My projects'
  // TODO: this should probably be extracted into its own component?
  if (appShell.inAppWebView) {
    return (
      <>
        <PageTitle title={title} />
        <OgMeta user={store.user} />
        <PagePad yControlOnly>
          <PagePad wide noPadY>
            <div className="flex flex-row mb-3 mt-3">
              <div className="flex-column">
                <div className="font-bold text-sm text-black-500">
                  {store.user.profile.name || 'Unnamed user'}
                </div>
                <h3>My projects</h3>
              </div>
              <div className="flex flex-column grow justify-end items-center relative">
                <Link
                  href={pathBuilder.userEdit(store.user.systemSlug)}
                  style={{ width: 54, height: 54 }}
                  className="flex shrink no-underline block"
                >
                  <UserAvatar user={store.user} />
                  <Image
                    className="absolute right-0 bottom-2"
                    width={16}
                    height={16}
                    src={settingsGear}
                    alt="profile settings"
                  />
                </Link>
              </div>
            </div>
            {store.user.profile.bio && (
              <p className="text-sm text-bodytext break-words whitespace-pre-line mb-2">
                {store.user.profile.bio}
              </p>
            )}
            <UserSocialLinks user={store.user} />
            {hasProjects ? (
              <ProjectList targetUser={store.user} />
            ) : (
              <>
                <div className="flex flex-row gap-4 my-2 mb-10">
                  <Link
                    intent="primary"
                    className="grow basis-1 sm:grow-0 sm:basis-auto"
                    href={pathBuilder.newProject(store.user.systemSlug)}
                    trackEvent={trackingEvents.bcCreatProjectHomeAuth}
                  >
                    Create project
                  </Link>
                </div>
                <p>You don't have any projects yet. Create a project.</p>
              </>
            )}
          </PagePad>
        </PagePad>
      </>
    )
  }

  const addCreatBtns = (
    <div className="flex flex-row gap-4 my-2 mb-10">
      <Link
        intent="primary"
        className="grow basis-1 sm:grow-0 sm:basis-auto"
        href={pathBuilder.newPost(store.user.systemSlug)}
        trackEvent={trackingEvents.bcAddPost}
        trackEventOpts={{ fromPage: 'homeAuth' }}
      >
        Add post
      </Link>
      {inBlankSlate ? (
        <Button
          intent="secondary"
          className="grow basis-1 sm:grow-0 sm:basis-auto"
          onClick={handleSkip}
          trackEvent={trackingEvents.bcSkipBlankSlate}
        >
          Skip for now
        </Button>
      ) : (
        <Link
          intent="secondary"
          className="grow basis-1 sm:grow-0 sm:basis-auto"
          href={pathBuilder.newProject(store.user.systemSlug)}
          trackEvent={trackingEvents.bcCreatProjectHomeAuth}
        >
          Create project
        </Link>
      )}
    </div>
  )
  if (!hasProjects && !hasProfileEdits && !skipBlankSlate) {
    return (
      <>
        <PagePad>
          <h3 className="mt-10 mb-4">Welcome to {branding.productName}!</h3>
          <p className="mt-6 mb-6">
            Let’s get started. Are you working on a hobby project right now?
            Click “Add post”, pick a photo from your camera roll, and start
            tracking your journey!
          </p>
          {addCreatBtns}
        </PagePad>
      </>
    )
  }
  return (
    <>
      <PageTitle title={title} />
      <OgMeta user={store.user} />
      <RemindersAndAlerts />
      <PagePad yControlOnly>
        <PagePad noPadY>
          <UserPreview user={store.user} compact={false} />
        </PagePad>
        <Divider light className="my-10" />
        <PagePad wide noPadY>
          <div>
            <h3 className="my-2">Your projects</h3>
            {addCreatBtns}
            <ProjectList targetUser={store.user} />
          </div>
        </PagePad>
      </PagePad>
    </>
  )
})

export default HomeAuth
