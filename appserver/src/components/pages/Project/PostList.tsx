import PostCard from '@/components/PostCard'
import { Link } from '@/components/uiLib'
import pathBuilder from '@/lib/pathBuilder'
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
  const isSelf = store.user && store.user.id === targetUser.id
  const posts = Object.values(project.posts)
  posts.sort((a, b) =>
    sort === 'desc' ? b.didThisAt - a.didThisAt : a.didThisAt - b.didThisAt
  )
  if (posts.length === 0)
    return (
      <div className="text-center py-20">
        <p>This project has no updates yet.</p>
        {!isSelf && (
          <p>
            Visit their{' '}
            <Link href={pathBuilder.user(targetUser.publicPageSlug)}>
              project page
            </Link>{' '}
            to see their other projects!
          </p>
        )}
      </div>
    )
  return (
    <>
      <div className="grid grid-cols-1 gap-8 border-l ml-2 border-#DDDDDD pl-4 mb-8">
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
