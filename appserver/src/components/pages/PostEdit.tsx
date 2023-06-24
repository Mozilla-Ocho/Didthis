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
import {H} from '../uiLib'

const PostEditPage = observer(() => {
  const store = useStore();
  const router = useRouter()
  const user = store.user
  if (!user) return <NotFound>user not found</NotFound>
  const projectId = getParamString(router, 'projectId')
  const project = user.profile.projects[projectId]
  if (!project) return <NotFound>project not found</NotFound>
  const postId = getParamString(router, 'postId')
  const post = project.posts[postId]
  if (!post) return <NotFound>post not found</NotFound>
  return (
    <>
      <Breadcrumbs
        crumbs={[
          {
            name: project.title,
            href: pathBuilder.project(user.systemSlug, project.id),
          },
          { name: post ? 'Edit post' : 'New post' },
        ]}
      />
      <H.H3>Edit post</H.H3>
      <PostForm mode="edit" post={post} />
    </>
  )
})

export default PostEditPage
