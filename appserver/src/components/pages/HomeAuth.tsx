import { observer } from 'mobx-react-lite'
import { useStore } from '@/lib/store'
import ProjectList from '@/components/ProjectList'
import { Divider, H, Link } from '@/components/uiLib'
import pathBuilder from '@/lib/pathBuidler'
import UserPreview from '../UserPreview'

const HomeAuth = observer(() => {
  const store = useStore()
  if (!store.user) return <></> // typescript helper, it doesn't know this component is auth only
  const hasProjects = Object.keys(store.user.profile.projects).length > 0
  return (
    <>
      <UserPreview user={store.user} />
      <div>
        {!hasProjects && (
          <div>
            <H.H4>Welcome to HOBBYR</H.H4>
            <p>
              get started by posting something about a project you’re working on
            </p>
            <Link
              intent="primary"
              href={pathBuilder.newPost(store.user.urlSlug)}
            >
              new post
            </Link>
          </div>
        )}
      </div>
      <Divider />
      <H.H4>Your projects:</H.H4>
      <Link intent="primary" href={pathBuilder.newProject(store.user.urlSlug)}>
        new project
      </Link>
      <ProjectList targetUser={store.user} />
    </>
  )
})

export default HomeAuth
