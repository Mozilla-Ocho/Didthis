// import { useStore } from "@/lib/store";
import { useRouter } from 'next/router'
import { observer } from 'mobx-react-lite'
import { H, Link, Timestamp, Divider, CloudinaryImage, Button } from '../uiLib'
import UserPreview from '../UserPreview'
import pathBuilder from '@/lib/pathBuidler'
import { getParamString } from '@/lib/nextUtils'
import NotFound from './NotFound'
import PostCard from '../PostCard'
import { useStore } from '@/lib/store'

const ProjectPage = observer(
  ({ targetUser }: { targetUser: ApiUser | false }) => {
    // const store = useStore();
    if (!targetUser) return <NotFound>user not found</NotFound>
    const router = useRouter()
    const store = useStore()
    const isSelf = store.user && store.user.id === targetUser.id
    if (isSelf && store.user) targetUser = store.user // important for mobx reactivity when authed
    const projectId = getParamString(router, 'projectId')
    const focusPostId = getParamString(router, 'postId')
    const project = targetUser.profile.projects[projectId]
    if (!project) return <NotFound>project not found</NotFound>
    const posts = Object.values(project.posts)
    posts.sort((a, b) => b.createdAt - a.createdAt)
    return (
      <>
        <div>
          <UserPreview user={targetUser} compact={true} />
          <H.H3>{project.title}</H.H3>
          {project.imageAssetId && (
            <CloudinaryImage assetId={project.imageAssetId} intent="project" />
          )}
          {store.user && isSelf && (
            <p>
              <Link
                href={pathBuilder.projectEdit(
                  store.user.systemSlug,
                  project.id
                )}
              >
                edit
              </Link>
            </p>
          )}
          {store.user && isSelf && (
            <p>
              <Button
                intent="link"
                onClick={() => store.promptDeleteProject(project)}
              >
                delete
              </Button>
            </p>
          )}
          <p>description: {project.description || 'no description'}</p>
          <p>visibility: {project.scope}</p>
          <p>status: {project.currentStatus}</p>
          <p># posts: {Object.keys(project.posts).length}</p>
          <p>
            created: <Timestamp millis={project.createdAt} />
          </p>
          <Divider />
          {store.user && // store.user redundant when isSelf but tsserver needs it
            isSelf && (
              <>
                <Link
                  intent="primary"
                  href={pathBuilder.newPost(store.user.systemSlug, project.id)}
                >
                  new post
                </Link>
                <Divider />
              </>
            )}
          <div className="grid grid-cols-1 gap-4">
            {/* even though we return above if targetUser is falsy, because map is
           passed a function, typescript can't assert that inside that function
           scope that targetUser is still surely not false. hence "as ApiUser"*/}
            {posts.map(p => (
              <PostCard
                key={p.id}
                post={p}
                authUser={store.user}
                targetUser={targetUser as ApiUser}
                focused={focusPostId === p.id}
              />
            ))}
          </div>
        </div>
      </>
    )
  }
)

export default ProjectPage
