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
      <div>
        <PostForm mode="edit" post={post} />
      </div>
    </>
  )
})

export default PostEditPage
