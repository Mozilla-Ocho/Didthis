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
    <PagePad>
      <UserPreview user={store.user} compact={false} />
      <Divider light />
      <div>
        <H.H3 className="my-4">Your projects:</H.H3>
        <div className="grid grid-cols-2 gap-4 my-4">
          <Link
            intent="primary"
            href={pathBuilder.newPost(store.user.systemSlug)}
          >
            Add post
          </Link>
          <Link
            intent="secondary"
            href={pathBuilder.newProject(store.user.systemSlug)}
          >
            Create project
          </Link>
        </div>
        <ProjectList targetUser={store.user} />
      </div>
    </PagePad>
  )
})

export default HomeAuth
