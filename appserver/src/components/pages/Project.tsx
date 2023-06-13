// import { useStore } from "@/lib/store";
import { useRouter } from 'next/router'
import { observer } from 'mobx-react-lite'
import { H, Link, Timestamp, Divider } from '../uiLib'
import UserPreview from '../UserPreview'
import pathBuilder from '@/lib/pathBuidler'
import { getParamString } from '@/lib/nextUtils'
import NotFound from './NotFound'
import PostCard from '../PostCard'
import { useStore } from '@/lib/store'

const ProjectPage = observer(({ targetUser }: { targetUser: ApiUser }) => {
  // const store = useStore();
  if (!targetUser) return <NotFound>user not found</NotFound>
  const router = useRouter()
  const store = useStore()
  const projectId = getParamString(router, 'projectId')
  const focusPostId = getParamString(router, 'postId')
  const project = targetUser.profile.projects[projectId]
  if (!project) return <NotFound>project not found</NotFound>
  const posts = Object.values(project.posts)
  posts.sort((a, b) => a.createdAt - b.createdAt)
  const isSelf = store.user && store.user.id === targetUser.id
  return (
    <>
      <div>
        <UserPreview user={targetUser} />
        <H.H3>{project.title}</H.H3>
        {store.user && isSelf && <p><Link href={pathBuilder.projectEdit(store.user.urlSlug, project.id)}>edit</Link></p>}
        <p>description: {project.description || "no description"}</p>
        <p>visibility: {project.scope}</p>
        <p>status: {project.currentStatus}</p>
        <p># posts: {Object.keys(project.posts).length}</p>
        <p>
          created: <Timestamp seconds={project.createdAt} />
        </p>
        <Divider />
        {store.user && // store.user redundant when isSelf but tsserver needs it
          isSelf && (
            <>
              <Link
                intent="primary"
                href={pathBuilder.newPost(store.user.urlSlug, project.id)}
              >
                new post
              </Link>
              <Divider />
            </>
          )}
        {posts.map(p => (
          <PostCard
            key={p.id}
            post={p}
            targetUser={targetUser}
            focused={focusPostId === p.id}
          />
        ))}
      </div>
    </>
  )
})

export default ProjectPage
