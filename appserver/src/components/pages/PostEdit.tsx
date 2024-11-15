// import { useStore } from "@/lib/store";
import { useRouter } from 'next/router'
import { observer } from 'mobx-react-lite'
// import { H, Link, Timestamp, Divider } from '../uiLib'
// import UserPreview from '../UserPreview'
// import pathBuilder from '@/lib/pathBuidler'
import { getParamString } from '@/lib/nextUtils'
import NotFound from './NotFound'
import { useStore } from '@/lib/store'
import PostForm from '@/components/forms/PostForm'
import Breadcrumbs from '../Breadcrumbs'
import pathBuilder from '@/lib/pathBuilder'
import { PagePad } from '../uiLib'
import {trackingEvents} from '@/lib/trackingEvents'
import PageTitle from '../PageTitle'
import RemindersAndAlerts from '../RemindersAndAlerts'
import useAppShell from '@/lib/appShellContent'

const PostEditPage = observer(() => {
  const store = useStore()
  const appShell = useAppShell()
  store.useTrackedPageEvent(trackingEvents.pvEditPost)
  const router = useRouter()
  const user = store.user
  if (!user) return <NotFound>user not found</NotFound>
  const projectId = getParamString(router, 'projectId')
  const project = user.profile.projects[projectId]
  if (!project) return <NotFound>project not found</NotFound>
  const postId = getParamString(router, 'postId')
  const post = project.posts[postId]
  if (!post) return <NotFound>update not found</NotFound>
  return (
    <>
      <PageTitle title="Edit update" />
      <Breadcrumbs
        crumbs={[
          {
            name: project.title,
            href: pathBuilder.project(user.systemSlug, project.id),
          },
          { name: post ? 'Edit update' : 'New update' },
        ]}
      />
      <RemindersAndAlerts />
      <PagePad>
        {!appShell.inAppWebView && <h3>Edit update</h3>}
        <PostForm mode="edit" project={project} post={post} />
      </PagePad>
    </>
  )
})

export default PostEditPage
