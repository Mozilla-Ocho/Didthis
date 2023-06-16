// import pathBuilder from "@/lib/pathBuidler";
import { observer } from 'mobx-react-lite'
import { Timestamp, CloudinaryImage, Link } from './uiLib'
import pathBuilder from '@/lib/pathBuidler'
import LinkPreview from './LinkPreview'

const PostCard = observer(
  // XXX focused should scroll
  ({
    post,
    authUser,
    targetUser,
    focused,
  }: {
    post: ApiPost
    authUser: ApiUser | false,
    targetUser: ApiUser
    focused: boolean
  }) => {
    const isSelf = (authUser && authUser.id === targetUser.id)
    return (
      <div className={`border p-4 ${focused ? 'border-4 bg-slate-50' : ''}`}>
        {isSelf && <p><Link href={pathBuilder.postEdit(authUser.urlSlug, post.projectId, post.id)}>edit</Link></p>}
        {post.imageAssetId && <CloudinaryImage assetId={post.imageAssetId} intent="post"/>}
        <p>{post.description}</p>
        {post.linkUrl && <LinkPreview linkUrl={post.linkUrl} urlMeta={post.urlMeta} />}
        <p>
          created <Timestamp seconds={post.createdAt} />
        </p>
        <p>
          updated <Timestamp seconds={post.updatedAt} />
        </p>
      </div>
    )
  }
)

export default PostCard
