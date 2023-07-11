import { observer } from 'mobx-react-lite'
import { useStore } from '@/lib/store'
import ProjectList from '@/components/ProjectList'
import { Button, Divider, Link, PagePad } from '@/components/uiLib'
import pathBuilder from '@/lib/pathBuilder'
import UserPreview from '../UserPreview'
import { useLocalStorage } from 'usehooks-ts'
import { useEffect, useState } from 'react'
import { trackingEvents } from '@/lib/trackingEvents'
import PageTitle from '../PageTitle'

const HomeAuth = observer(() => {
  const store = useStore()
  const [skipBlankSlate, setSkipBlankSlate] = useLocalStorage(
    'skipBlankSlate', // DRY_26502
    false
  )
  const [rendered, setRendered] = useState(false)
  store.useTrackedPageEvent(trackingEvents.pvHomeAuth)
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
          <h3 className="mt-10 mb-4">Account created!</h3>
          <p className="mb-6">
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
      <PageTitle title={store.user.userSlug || store.user.profile.name} />
      <PagePad yControlOnly>
        <PagePad noPadY>
          <UserPreview user={store.user} compact={false} />
        </PagePad>
        <Divider light className="my-10" />
        <PagePad wide noPadY>
          <div>
            <h3 className="my-2">Your projects:</h3>
            {addCreatBtns}
            <ProjectList targetUser={store.user} />
          </div>
        </PagePad>
      </PagePad>
    </>
  )
})

export default HomeAuth
