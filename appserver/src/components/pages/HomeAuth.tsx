import { observer } from 'mobx-react-lite'
import { useStore } from '@/lib/store'
import ProjectList from '@/components/ProjectList'
import { Divider, H, Link, PagePad } from '@/components/uiLib'
import pathBuilder from '@/lib/pathBuilder'
import UserPreview from '../UserPreview'

const HomeAuth = observer(() => {
  const store = useStore()
  if (!store.user) return <></> // typescript helper, it doesn't know this component is auth only
  // const hasProjects = Object.keys(store.user.profile.projects).length > 0
  return (
    <>
      <PagePad yControlOnly>
        <PagePad noPadY>
          <UserPreview user={store.user} compact={false} />
        </PagePad>
      <Divider light className="my-10"/>
      <PagePad wide noPadY>
        <div>
          <H.H3 className="my-2">Your projects:</H.H3>
          <div className="flex flex-row gap-4 my-2 mb-10">
            <Link
              intent="primary"
              className="grow basis-1 sm:grow-0 sm:basis-auto"
              href={pathBuilder.newPost(store.user.systemSlug)}
            >
              Add post
            </Link>
            <Link
              intent="secondary"
              className="grow basis-1 sm:grow-0 sm:basis-auto"
              href={pathBuilder.newProject(store.user.systemSlug)}
            >
              Create project
            </Link>
          </div>
          <ProjectList targetUser={store.user} />
        </div>
      </PagePad>
      </PagePad>
    </>
  )
})

export default HomeAuth
