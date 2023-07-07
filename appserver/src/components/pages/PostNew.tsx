import { observer } from 'mobx-react-lite'
import { useStore } from '@/lib/store'
import { PagePad } from '@/components/uiLib'
import LoginBouncer from '@/components/auth/LoginBouncer'
import PostForm from '@/components/forms/PostForm'
import Breadcrumbs from '../Breadcrumbs'
import { getParamString } from '@/lib/nextUtils'
import { useRouter } from 'next/router'
import pathBuilder from '@/lib/pathBuilder'
import {trackingEvents} from '@/lib/trackingEvents'

const NewPostPage = observer(() => {
  const store = useStore()
  const router = useRouter()
  if (!store.user) {
    return <LoginBouncer />
  }
  const projPid = getParamString(router, 'projectId')
  const project = store.user.profile.projects[projPid] // possibly undef
  store.useTrackedPageEvent(trackingEvents.pvNewPost,{newProject:projPid ? "n" : "y"})
  // note the PostForm component will look at the router path and get the
  // project id if any.
  return (
    <>
      <Breadcrumbs
        crumbs={[
          project
            ? {
                name: project.title,
                href: pathBuilder.project(
                  store.user.publicPageSlug,
                  project.id
                ),
              }
            : { name: 'New project' },
          { name: 'Add post' },
        ]}
      />
      <PagePad>
        <h3>Add post</h3>
        <PostForm mode="new" />
      </PagePad>
    </>
  )
})

export default NewPostPage
