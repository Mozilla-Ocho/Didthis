import PostCard from '@/components/PostCard'
import { useStore } from '@/lib/store'

const PostList = ({
  project,
  sort,
  targetUser,
  focusPostId,
}: {
  project: ApiProject
  sort: 'asc' | 'desc'
  targetUser: ApiUser
  focusPostId: string
}) => {
  const store = useStore()
  const posts = Object.values(project.posts)
  posts.sort((a, b) =>
    sort === 'desc' ? b.didThisAt - a.didThisAt : a.didThisAt - b.didThisAt
  )
  if (posts.length === 0)
    return (
      <>
        <p>This project has no updates yet.</p>
      </>
    )
  return (
    <>
      <div className="grid grid-cols-1 gap-8">
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
    </>
  )
}

export default PostList
