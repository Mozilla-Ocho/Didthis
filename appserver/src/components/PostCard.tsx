// import pathBuilder from "@/lib/pathBuidler";
import { observer } from 'mobx-react-lite'
import { Timestamp, CloudinaryImage, Link, Button } from './uiLib'
import pathBuilder from '@/lib/pathBuidler'
import LinkPreview from './LinkPreview'
import { useStore } from '@/lib/store'

const PostCard = observer(
  ({
    post,
    authUser,
    targetUser,
    focused,
  }: {
    post: ApiPost
    authUser: ApiUser | false
    targetUser: ApiUser
    focused: boolean
  }) => {
    const isSelf = authUser && authUser.id === targetUser.id
    const store = useStore()
    return (
      <div>
        <p className="text-bs text-timestamps mb-2">
          <Timestamp millis={post.createdAt} />
        </p>
        {post.imageAssetId && (
          <CloudinaryImage assetId={post.imageAssetId} intent="post" />
        )}
        {post.linkUrl && (
          <LinkPreview linkUrl={post.linkUrl} urlMeta={post.urlMeta} />
        )}
        <p className="my-2 break-words whitespace-pre-line">
          {post.description}
        </p>
        {isSelf && (
          <div className="grid grid-cols-[auto_1fr] gap-4 items-baseline">
            <Link
              intent="secondary"
              href={pathBuilder.postEdit(
                authUser.systemSlug,
                post.projectId,
                post.id
              )}
            >
              Edit
            </Link>
            <div className="text-right">
              <Button
                intent="link"
                onClick={() => store.promptDeletePost(post)}
              >
                Delete
              </Button>
            </div>
          </div>
        )}
      </div>
    )
  }
)

export default PostCard
